import { prisma } from "@/app/utils/db";
import { stripe } from "@/app/utils/stripe";
import { headers } from "next/headers";
import Stripe from "stripe";

export async function POST(req: Request): Promise<Response> {
  // 1) Read the raw body as text
  const body = await req.text();

  // 2) Grab the Stripe signature header
  const sigHeader = (await headers()).get("Stripe-Signature");
  if (!sigHeader) {
    console.error("Missing Stripe-Signature header");
    return new Response("Missing Stripe-Signature", { status: 400 });
  }

  // 3) Construct the event
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      sigHeader,
      process.env.STRIPE_WEBHOOK_SECRET as string
    );
  } catch (err) {
    console.error("⚠️  Webhook signature verification failed.", err);
    return new Response("Webhook error", { status: 400 });
  }

  // 4) Handle only checkout.session.completed
  if (event.type === "checkout.session.completed") {
    const session = event.data
      .object as Stripe.Checkout.Session;

    const customerId = session.customer as string;
    const rawJobId = session.metadata?.jobId;
    if (!rawJobId) {
      console.error("No jobId in session.metadata");
      return new Response("No jobId", { status: 400 });
    }

    // 5) Cast jobId → number
    const jobId = parseInt(rawJobId, 10);
    if (Number.isNaN(jobId)) {
      console.error("Invalid jobId:", rawJobId);
      return new Response("Invalid jobId", { status: 400 });
    }

    // 6) Lookup the user by Stripe customer ID
    const user = await prisma.user.findUnique({
      where: { stripeCustomerId: customerId },
    });
    if (!user) {
      console.error(
        `No user for stripeCustomerId=${customerId}`
      );
      return new Response("User not found", { status: 404 });
    }

    // 7) Update the job status, ensuring it belongs to this user.
    //    Prisma.update only accepts a unique filter. If your JobPost
    //    model’s primary key is just `id`, omit userId here and
    //    rely on a prior ownership check (or use updateMany).
    const result = await prisma.jobPost.updateMany({
      where: {
        id: jobId,
        userId: user.id,
      },
      data: { status: "ACTIVE" },
    });

    if (result.count === 0) {
      console.error(
        `Job #${jobId} not found or not owned by user #${user.id}`
      );
      return new Response("Job not updated", { status: 404 });
    }
  }

  // 8) Always return 2xx for unhandled event types
  return new Response(null, { status: 200 });
}
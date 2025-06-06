import { prisma } from "@/app/utils/db";
import { stripe } from "@/app/utils/stripe";
import { headers } from "next/headers";
import Stripe from "stripe";

export async function POST(req: Request): Promise<Response> {
  // 1) Read the raw body as text
  const body = await req.text();

  // 2) Grab the Stripe signature header
  const sig = (await headers()).get("Stripe-Signature");
  if (!sig) {
    console.error("Missing Stripe-Signature header");
    return new Response("Missing signature", { status: 400 });
  }

  // 3) Verify & construct the Stripe event
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET as string
    );
  } catch (err) {
    console.error("⚠️ Stripe webhook signature verification failed:", err);
    return new Response("Webhook signature verification failed", { status: 400 });
  }

  // 4) Only handle checkout.session.completed
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const customerId = session.customer as string;
    const jobId = session.metadata?.jobId;
    if (!jobId) {
      console.error("No jobId in session.metadata");
      return new Response("Missing jobId", { status: 400 });
    }

    // 5) Lookup your User by their Stripe customer ID
    const user = await prisma.user.findUnique({
      where: { stripeCustomerId: customerId },
    });
    if (!user) {
      console.error(`No user found for Stripe customer ${customerId}`);
      return new Response("User not found", { status: 404 });
    }

    // 6) Atomically update the JobPost to ACTIVE only if it belongs to this user's company
    const result = await prisma.jobPost.updateMany({
      where: {
        id: jobId,
        Company: { userId: user.id },
      },
      data: { status: "ACTIVE" },
    });

    if (result.count === 0) {
      console.error(
        `No job post ${jobId} owned by company of user ${user.id}`
      );
      return new Response("Job not found or not yours", { status: 404 });
    }
  }

  // 7) Return a 200 for all other event types & success paths
  return new Response(null, { status: 200 });
}
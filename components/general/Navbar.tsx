import Link from "next/link";
import { buttonVariants } from "../ui/button";
import { Cog } from "lucide-react";
import { ThemeToggle } from "@/components/general/ThemeToggle";
import { auth } from "@/app/utils/auth";
import { UserDropdown } from "./UserDropdown";

export async function Navbar() {
  const session = await auth();
  const userType = (session?.user as { userType?: "COMPANY" | "JOB_SEEKER" })?.userType; // "COMPANY" | "JOB_SEEKER" | undefined

  return (
    <nav className="flex items-center justify-between py-5">
      {/* Logo / Brand */}
      <Link href="/" className="flex items-center gap-3">
        <Cog className="size-7" />
        <h1 className="text-2xl font-bold">
          Jobs in Central<span className="text-primary"> Illinois</span>
        </h1>
      </Link>

      {/* Right Side Navigation */}
      <div className="hidden md:flex items-center gap-5">
        <ThemeToggle />

        {userType === "COMPANY" && (
          <>
            <Link
              href="/post-job"
              className={buttonVariants({ size: "lg" })}
            >
              Post Job
            </Link>
            <Link
              href="/submissions"
              className={buttonVariants({ variant: "ghost", size: "lg" })}
            >
              Applications
            </Link>

            <Link
                href="/my-jobs"
                className={buttonVariants({ variant: "ghost", size: "lg" })}
                >
                My Jobs
            </Link>
          </>


        )}

        {userType === "JOB_SEEKER" && (
          <Link
            href="/my-applications"
            className={buttonVariants({ variant: "ghost", size: "lg" })}
          >
            My Applications
          </Link>
        )}

        {session?.user ? (
          <UserDropdown
            email={session.user.email as string}
            image={session.user.image as string}
            name={session.user.name as string}
          />
        ) : (
          <Link
            href="/login"
            className={buttonVariants({ variant: "outline", size: "lg" })}
          >
            Login
          </Link>
        )}
      </div>
    </nav>
  );
}

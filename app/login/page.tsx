
import Link from "next/link";
import {LoginForm} from "@/components/forms/LoginForm";
import {Cog} from "lucide-react";


export default function Login() {
    return (
        <div className="min-h-screen w-screen flex items-center justify-center">
            <div className="flex w-full max-w-sm flex-col gap-6">
                <Link href="/" className={"flex items-center gap-2 self-center"}>
                    <Cog className={"size-7"} />
                    <h1 className={"text-2xl font-bold"}>
                        Jobs in<span className={"text-primary"}> Central Illinois</span>
                    </h1>
                </Link>
                <LoginForm />
            </div>
        </div>
    )
}
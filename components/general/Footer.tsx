import { Cog,
} from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
   <footer className="mt-10 md:mt-20 lg:mt-32 w-full sticky bottom-0 bg-muted border-t border-border z-50 shadow-sm px-4 py-3">

      {/* Brand Section */}
      <div className=" m-10 max-w-7xl mx-auto px-4 py-2 sm:px-6 lg:px-8 flex justify-center ">
        <Link href="/" className="flex items-center gap-3">
          <Cog className="size-7 text-primary" />
          <h1 className="text-2xl font-bold text-foreground">
            Jobs in<span className="text-primary"> Macon County</span>
          </h1>
        </Link>
      </div>


      <div className="border-t border-border py-4 px-4 sm:px-6 lg:px-8 text-xs text-center text-muted-foreground">
        © {new Date().getFullYear()} Starlight Creative Studios, LLC. All rights reserved.
      </div>
    </footer>
  );
}

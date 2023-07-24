import Link from "next/link";

import { FooterNav } from "@/components/layout/footer-nav";
import { Icons } from "@/components/ui/icons";
import Logo from "@/components/ui/logo";

export function Footer() {
  return (
    <footer className="flex items-center border-t border-gray-800 bg-foreground text-background lg:h-20">
      <div className="mx-auto w-full max-w-7xl">
        <div className="grid grid-cols-1 items-center gap-y-4 p-4 text-center lg:grid-cols-3 lg:py-0">
          <div className="flex items-center justify-center lg:justify-start">
            <Logo />
          </div>

          <FooterNav />

          <div className="flex items-center justify-center gap-4 lg:justify-end">
            <p className="inline-flex text-sm">&copy; {new Date().getFullYear()} recommen.do</p>

            <div>
              <Link href="https://github.com/alexbacanu/recommen.do" aria-label="Github link">
                <Icons.github className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

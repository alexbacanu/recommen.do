import Link from "next/link";

import Logo from "@/components/ui/logo";
import { navConfig } from "@/lib/config/navigation";

export function Footer() {
  return (
    <footer className="flex items-center border-t border-border bg-foreground/90 text-background lg:h-20">
      <div className="mx-auto w-full max-w-7xl">
        <div className="grid grid-cols-1 items-center gap-y-4 p-4 text-center lg:grid-cols-3 lg:py-0">
          <div className="flex items-center justify-center lg:justify-start">
            <Logo />
          </div>

          <div className="flex flex-col gap-y-2">
            <ul className="text-center">
              {navConfig.footer.map((item, index) => (
                <li
                  key={index}
                  className="relative inline-block pr-6 before:absolute before:right-2 before:top-1/2 before:-translate-y-1/2 before:text-gray-300 before:content-['/'] last:pr-0 last-of-type:before:hidden"
                >
                  <Link
                    href={item.href}
                    className="inline-flex gap-x-2 text-sm transition-colors hover:text-indigo-400"
                  >
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
            <Link href="#" className="text-sm" data-cc="show-preferencesModal">
              Cookie settings 🍪
            </Link>
          </div>

          <div className="text-center lg:text-right">
            <p className="inline-flex text-sm">&copy; {new Date().getFullYear()} recommen.do</p>
          </div>
        </div>
      </div>
    </footer>
  );
}

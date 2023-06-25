import Link from "next/link";

import { navConfig } from "@/components/layout/navigation";

export function FooterNav() {
  return (
    <div className="flex flex-col gap-y-2">
      <ul className="text-center">
        {navConfig.footer.map((item, index) => (
          <li
            key={index}
            className="relative inline-block pr-6 before:absolute before:right-2 before:top-1/2 before:-translate-y-1/2 before:text-border/50 before:content-['/'] last:pr-0 last-of-type:before:hidden"
          >
            <Link href={item.href} className="inline-flex gap-x-2 text-sm transition-colors hover:text-primary/95">
              {item.title}
            </Link>
          </li>
        ))}
      </ul>
      <Link href="#" className="text-sm" data-cc="show-preferencesModal">
        Cookie settings 🍪
      </Link>
    </div>
  );
}

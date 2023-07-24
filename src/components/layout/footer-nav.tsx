import Link from "next/link";

import { navConfig } from "@/components/layout/navigation";

export function FooterNav() {
  return (
    <div className="flex flex-col gap-y-2">
      <ul className="text-center">
        {navConfig.footer.map((item, index) => (
          <li
            key={index}
            className="relative inline-block pr-4 before:absolute before:right-1 before:top-1/2 before:-translate-y-1/2 before:text-border/30 before:content-['/'] last:pr-0 last-of-type:before:hidden"
          >
            <Link
              href={item.href}
              className="inline-flex gap-x-2 text-sm transition-colors hover:text-primary/95"
              aria-label={`Navigate to ${item.title} page`}
            >
              {item.title}
            </Link>
          </li>
        ))}
      </ul>
      <Link href="#" className="text-sm" data-cc="show-preferencesModal" aria-label="Cookie settings">
        Cookie settings 🍪
      </Link>
    </div>
  );
}

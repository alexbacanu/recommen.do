import Link from "next/link";

import { navConfig } from "@/components/layout/navigation";

export function HeaderNav() {
  return (
    <nav className="flex gap-x-6">
      {navConfig.header.map((item, index) => (
        <Link
          href={item.disabled ? "#" : item.href}
          key={index}
          className="text-base font-normal tracking-wide transition-colors hover:text-primary/80"
          aria-label={`Navigate to ${item.title} page`}
        >
          {item.title}
        </Link>
      ))}
    </nav>
  );
}

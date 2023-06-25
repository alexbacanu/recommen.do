import Link from "next/link";

import { navConfig } from "@/components/layout/navigation";

export function HeaderNav() {
  return (
    <nav className="hidden gap-x-6 sm:flex">
      {navConfig.header.map((item, index) => (
        <Link
          href={item.disabled ? "#" : item.href}
          key={index}
          className="text-base font-normal tracking-wide transition-colors hover:text-primary/80"
        >
          {item.title}
        </Link>
      ))}
    </nav>
  );
}

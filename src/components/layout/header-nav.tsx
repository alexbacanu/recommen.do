import Link from "next/link";

import { navConfig } from "@/components/layout/navigation";

export function HeaderNav() {
  return (
    <nav className="hidden gap-x-6 font-medium sm:flex">
      {navConfig.header.map((item, index) => (
        <Link href={item.disabled ? "#" : item.href} key={index} className="transition-colors hover:text-indigo-500">
          {item.title}
        </Link>
      ))}
    </nav>
  );
}

import Link from "next/link";

import { navConfig } from "~/lib/config/navigation";

export function Header() {
  return (
    <header className="placeholder">
      <nav className="flex gap-4">
        {navConfig.header.map((item, index) => (
          <Link key={index} href={item.disabled ? "#" : item.href}>
            {item.title}
          </Link>
        ))}
      </nav>
    </header>
  );
}

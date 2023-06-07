import Link from "next/link";

import { navConfig } from "~/lib/config/navigation";

export function Navigation() {
  return navConfig.header.map((item, index) => (
    <Link key={index} href={item.disabled ? "#" : item.href}>
      {item.title}
    </Link>
  ));
}

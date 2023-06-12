import Link from "next/link";

import { navConfig } from "~/lib/config/navigation";
import { cn } from "~/lib/helpers/cn";

interface NavigationProps {
  showMobile?: boolean;
}

export function Navigation({ showMobile = false }: NavigationProps) {
  return (
    <nav className={"hidden md:flex md:gap-x-6"}>
      {navConfig.header.map((item, index) => (
        <Link
          key={index}
          href={item.disabled ? "#" : item.href}
          className={cn(
            "text-base font-medium text-foreground/60 transition-colors hover:text-foreground/80",
            item.disabled && "cursor-not-allowed opacity-80",
          )}
        >
          {item.title}
        </Link>
      ))}
    </nav>
  );
}

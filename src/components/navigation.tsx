import Link from "next/link";

import { cn } from "~/lib/helpers/cn";

interface NavigationProps {
  navigation: {
    title: string;
    href: string;
    disabled?: boolean;
    "data-cc"?: string;
  }[];
  hideOnMobile?: boolean;
}

export function Navigation({ navigation, hideOnMobile = false }: NavigationProps) {
  return (
    <nav className={cn("flex flex-col sm:flex-row gap-y-2 gap-x-6", hideOnMobile && "hidden md:flex sm:flex-row")}>
      {navigation.map((item, index) => (
        <Link
          key={index}
          href={item.disabled ? "#" : item.href}
          className={cn(
            "text-base font-medium transition-colors hover:text-indigo-500",
            item.disabled && "cursor-not-allowed opacity-80",
          )}
          data-cc={item["data-cc"]}
        >
          {item.title}
        </Link>
      ))}
    </nav>
  );
}

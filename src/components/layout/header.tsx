"use client";

import { usePathname } from "next/navigation";

import Download from "@/components/download";
import { Navigation } from "@/components/navigation";
import Logo from "@/components/ui/logo";
import { Profile } from "@/components/user";
import { navConfig } from "@/lib/config/navigation";
import { cn } from "@/lib/utils";

export function Header() {
  const pathname = usePathname();
  const isProfile = pathname.includes("/profile");

  return (
    <header
      className={cn(
        "top-0 z-10 border-b h-20 flex items-center border-border bg-card transition-all duration-300",
        isProfile && "bg-primary",
      )}
    >
      <div
        className={cn(
          "flex w-full px-4 max-w-7xl mx-auto items-center justify-between transition-all duration-300",
          isProfile && "bg-white rounded-xl py-2",
        )}
      >
        <div className="flex items-center gap-x-8">
          {!isProfile && <Logo />}
          {isProfile ? (
            <Navigation navigation={navConfig.dashboard} hideOnMobile={false} />
          ) : (
            <Navigation navigation={navConfig.header} hideOnMobile={true} />
          )}
        </div>

        <div className="flex items-center gap-x-4">
          {!isProfile && <Download />}
          <Profile />
        </div>
      </div>
    </header>
  );
}

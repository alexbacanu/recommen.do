"use client";

import { usePathname } from "next/navigation";

import Download from "~/components/download";
import { Navigation } from "~/components/navigation";
import Logo from "~/components/ui/logo";
import { Dashboard } from "~/components/user";
import { navConfig } from "~/lib/config/navigation";
import { cn } from "~/lib/helpers/cn";

export function Header() {
  const pathname = usePathname();
  const isProfile = pathname.includes("/profile");

  return (
    <header
      className={cn(
        "top-0 z-10 border-b transition-all duration-300 border-border bg-card/80 backdrop-blur-xl",
        isProfile && "bg-primary py-5 px-2",
      )}
    >
      <div
        className={cn(
          "mx-auto flex max-w-7xl transition-all duration-300 justify-between px-4 py-6",
          isProfile && "bg-white rounded-lg py-2",
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
          <Dashboard />
        </div>
      </div>
    </header>
  );
}

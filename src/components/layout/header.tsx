import { HeaderNav } from "@/components/layout/header-nav";
import { HeaderUser } from "@/components/layout/header-user";
import Logo from "@/components/ui/logo";
import { Separator } from "@/components/ui/separator";

export function Header() {
  return (
    <header className="z-10 flex h-20 items-center border-b border-border bg-card text-sm">
      <div className="mx-auto w-full max-w-7xl">
        <div className="flex items-center justify-between gap-y-4 p-4 lg:py-0">
          <Logo />

          <div className="flex items-center">
            <HeaderNav />

            <Separator orientation="vertical" className="mx-4 hidden h-5 sm:block" />

            <HeaderUser />
          </div>
        </div>
      </div>
    </header>
  );
}

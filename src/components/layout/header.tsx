import DownloadButton from "@/components/layout/download-button";
import { HeaderNav } from "@/components/layout/header-nav";
import { HeaderUser } from "@/components/layout/header-user";
import Logo from "@/components/ui/logo";
import { Separator } from "@/components/ui/separator";

export function Header() {
  return (
    <header className="z-10 flex items-center border-b border-border bg-card text-sm lg:h-20">
      <div className="mx-auto w-full max-w-7xl">
        <div className="flex items-center justify-between gap-y-4 p-4 sm:flex-col lg:flex-row lg:py-0">
          <div className="flex items-center">
            <Logo />

            <Separator orientation="vertical" className="mx-6 hidden sm:block" />

            <HeaderNav />
          </div>
          <div className="grid items-center gap-4 sm:grid-cols-[1fr_auto]">
            <DownloadButton />
            <HeaderUser />
          </div>
        </div>
      </div>
    </header>
  );
}

import DownloadButton from "@/components/layout/download-button";
import { HeaderNav } from "@/components/layout/header-nav";
import { HeaderUser } from "@/components/layout/header-user";
import Logo from "@/components/ui/logo";
import { Separator } from "@/components/ui/separator";

export function Header() {
  return (
    <header className="z-10 flex lg:h-20 items-center border-b border-border bg-card text-sm">
      <div className="mx-auto w-full max-w-7xl">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-y-4 p-4 lg:py-0">
          <div className="flex items-center">
            <Logo />

            <Separator orientation="vertical" className="mx-6" />

            <HeaderNav />
          </div>
          <div className="flex items-center gap-4">
            <DownloadButton />
            <HeaderUser />
          </div>
        </div>
      </div>
    </header>
  );
}

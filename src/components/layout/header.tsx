import Download from "~/components/download";
import { Navigation } from "~/components/navigation";
import Logo from "~/components/ui/logo";
import { Dashboard } from "~/components/user";

export function Header() {
  return (
    <header className="top-0 z-10 bg-card/80 shadow backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl justify-between px-4 py-6">
        <div className="flex items-center gap-x-8">
          <Logo />
          <Navigation />
        </div>

        <div className="flex items-center gap-x-4">
          <Download />
          <Dashboard />
        </div>
      </div>
    </header>
  );
}

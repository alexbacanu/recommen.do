import { Navigation } from "~/components/navigation";
import { User } from "~/components/user";

export function Header() {
  return (
    <header className="placeholder flex justify-between items-center">
      <nav className="flex gap-4">
        <Navigation />
      </nav>
      <div>
        <User />
      </div>
    </header>
  );
}

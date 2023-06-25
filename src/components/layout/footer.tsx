import { FooterNav } from "@/components/layout/footer-nav";
import Logo from "@/components/ui/logo";

export function Footer() {
  return (
    <footer className="flex items-center border-t border-border bg-foreground/90 text-background lg:h-20">
      <div className="mx-auto w-full max-w-7xl">
        <div className="grid grid-cols-1 items-center gap-y-4 p-4 text-center lg:grid-cols-3 lg:py-0">
          <div className="flex items-center justify-center lg:justify-start">
            <Logo />
          </div>

          <FooterNav />

          <div className="text-center lg:text-right">
            <p className="inline-flex text-sm">&copy; {new Date().getFullYear()} recommen.do</p>
          </div>
        </div>
      </div>
    </footer>
  );
}

import { Navigation } from "@/components/navigation";
import Logo from "@/components/ui/logo";
import { navConfig } from "@/lib/config/navigation";

export function Footer() {
  return (
    <footer className="flex items-center border-t border-border bg-foreground/90 text-background lg:h-20">
      <div className="mx-auto w-full max-w-7xl">
        <div className="flex flex-col items-center justify-between gap-y-6 px-4 py-6 lg:flex-row">
          <div className="flex items-center gap-x-8">
            <Logo />
            <Navigation navigation={navConfig.footer} />
          </div>
          <p className="text-sm">Copyright &copy; {new Date().getFullYear()} recommen.do</p>
        </div>
        {/* <div className="flex items-center justify-center gap-x-5 px-4 pb-6">
          <Link href="https://vercel.com/">
            <Image src="/vercel.svg" alt="Vercel logo" width={88} height={20} className="h-5 w-auto" />
          </Link>
          +
          <Link href="https://cloud.appwrite.io/">
            <Image src="/appwrite.svg" alt="Appwrite logo" width={112} height={20} className="h-5 w-auto" />
          </Link>
        </div> */}
      </div>
    </footer>
  );
}

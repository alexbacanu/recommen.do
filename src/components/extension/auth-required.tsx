import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Icons } from "@/components/ui/icons";
import { Shell } from "@/components/ui/shell";
import { appwriteUrl } from "@/lib/envClient";

export default function AuthRequiredCard() {
  return (
    <Shell layout="confirmation" className="py-10">
      <div className="flex items-center text-2xl">
        <Icons.login className="mr-2 mt-1 h-6 w-6 text-primary" aria-hidden="true" />
        <p>Login</p>
      </div>

      <p className="-mt-4 text-base">In order to use the extension you need to login to your account.</p>

      <Button variant="default" asChild>
        <Link href={`${appwriteUrl}/sign-in`} target="_blank" aria-label="Go to login page">
          Go to login page
        </Link>
      </Button>

      {/* <div className="flex items-center justify-center text-2xl">
        <Icons.login className="mr-2 mt-1 h-6 w-6 text-primary" aria-hidden="true" />
        <p>Login</p>
      </div>

      <div className="grid gap-1 text-center text-base">
        <p>In order to use the extension you need to login to your account.</p>
        <p>Congrats! You have successfully installed the extension.</p>
        <p>Please login to continue</p>
      </div>

      <div className="grid gap-1 text-sm">
        <Button variant="default" asChild>
          <Link href={`${appwriteUrl}/sign-in`} target="_blank" aria-label="Go to login page">
            Go to login page
          </Link>
        </Button>
      </div>

      <div><Illustration aria-label="undraw festivities illustration" /></div> */}
    </Shell>
  );
}

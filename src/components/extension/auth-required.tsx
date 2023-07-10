import Link from "next/link";
import Illustration from "react:/assets/undraw_secure_login.svg";

import { Button } from "@/components/ui/button";
import { CardTitle } from "@/components/ui/card";
import { Icons } from "@/components/ui/icons";
import { Shell } from "@/components/ui/shell";
import { appwriteUrl } from "@/lib/envClient";

export default function AuthRequiredCard() {
  return (
    <Shell layout="unauthorized" className="py-8">
      <div className="grid gap-8">
        <CardTitle className="flex items-center text-2xl tracking-normal">
          <Icons.login className="mr-2 mt-1 h-6 w-6 text-primary" aria-hidden="true" />
          Sign in
        </CardTitle>

        <div className="-mt-2 text-base">
          <p>In order to use the extension you need to sign in to your account.</p>
        </div>

        <div className="-mt-2 px-12 opacity-90">
          <Illustration aria-label="undraw festivities illustration" />
        </div>

        <div className="mt-2 grid">
          <Button variant="default" asChild>
            <Link href={`${appwriteUrl}/sign-in`} target="_blank" aria-label="Go to sign in page">
              Go to sign in page
            </Link>
          </Button>
        </div>
      </div>
    </Shell>
  );
}

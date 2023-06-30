import Illustration from "react:/assets/undraw_festivities.svg";

import { Button } from "@/components/ui/button";
import { Icons } from "@/components/ui/icons";
import { Shell } from "@/components/ui/shell";
import { appwriteUrl } from "@/lib/envClient";

export default function AuthRequiredCard() {
  return (
    <Shell layout="confirmation">
      <div className="flex items-center justify-center text-2xl">
        <Icons.login className="mr-2 mt-1 h-6 w-6 text-primary" aria-hidden="true" />
        <p>You need to login</p>
      </div>

      <div className="grid gap-1 text-sm">
        <p>Congrats! You have successfully installed the extension.</p>
        <p>Please login to continue</p>
      </div>

      <div className="grid gap-1 text-sm">
        <Button variant="default" asChild>
          <a href={`${appwriteUrl}/sign-in`} target="_blank" aria-label="Go to login page">
            Go to login page
          </a>
        </Button>
      </div>

      <div>
        <Illustration aria-label="undraw festivities illustration" />
      </div>
    </Shell>
  );
}

import { useAtomValue } from "jotai";

import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { accountAtom } from "@/lib/atoms/appwrite";
import { authuiSite } from "@/lib/envClient";

export function Login() {
  const account = useAtomValue(accountAtom);

  if (account && !account?.emailVerification) return;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-x-6">
          <CardTitle className="">Dashboard</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-xl font-semibold text-muted-foreground">Please login to view dashboard</div>
      </CardContent>
      <CardFooter className="grid grid-cols-1 gap-4">
        <a href={authuiSite} target="_blank" className={buttonVariants({ variant: "outline" })}>
          Log in
        </a>
      </CardFooter>
    </Card>
  );
}

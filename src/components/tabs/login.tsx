import { useAtomValue } from "jotai";

import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { accountAtom } from "~/lib/atoms/appwrite";

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
    </Card>
  );
}

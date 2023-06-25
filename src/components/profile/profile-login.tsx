import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useAccount } from "@/lib/hooks/use-account";

export function Login() {
  const { account } = useAccount();

  if (account && !account?.emailVerification) return;

  // const extensionDetected = !!window && !window?.next;
  // const target = extensionDetected ? "_blank" : "_self";

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
        {/* <a href={authuiSite} target={target} className={buttonVariants({ variant: "outline" })}>
          Log in
        </a> */}
      </CardFooter>
    </Card>
  );
}

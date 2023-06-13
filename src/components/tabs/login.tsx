import { Button } from "~/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "~/components/ui/card";

export function Login() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-x-6">
          {/* <img src={logoSrc} alt="Pickassistant" className="object-contain h-6" /> */}
          <CardTitle className="">Dashboard</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-xl font-semibold text-muted-foreground">Please login to view dashboard</div>
      </CardContent>
      <CardFooter className="grid grid-cols-1 gap-4">
        <Button variant="outline" asChild>
          <a href="https://pickassistant.authui.site/">Log in</a>
        </Button>
      </CardFooter>
    </Card>
  );
}

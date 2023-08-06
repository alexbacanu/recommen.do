import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Icons } from "@/components/ui/icons";
import { appwriteUrl } from "@/lib/envClient";

import "@/styles/globals.css";

import Link from "next/link";

export default function Onboarding() {
  const extensionDetected = !window?.next;
  const target = extensionDetected ? "_blank" : "_self";

  return (
    <div>
      <div className="p-4">
        <Link href={appwriteUrl} className="mx-auto flex max-w-2xl items-center justify-center gap-4 pb-4">
          <Icons.logo className="mt-2 h-12 w-12" aria-label="recommen.do logo" />

          <span className="text-4xl">recommen.do</span>
        </Link>

        <Card className="mx-auto max-w-2xl rounded-2xl shadow-2xl">
          <CardHeader className="gap-2 text-center">
            <CardTitle>
              <span className="text-lg text-card-foreground">Thanks for installing recommen.do extension!</span>
            </CardTitle>

            <CardDescription className="text-muted-foreground">Your AI recommendations for shopping!</CardDescription>
          </CardHeader>

          <CardContent className="grid gap-4">
            <h2 className="border-b pb-2 text-xl font-semibold tracking-tight transition-colors">
              Summary of technical or interaction data collected and processed:
            </h2>

            <div>
              <ul className="grid gap-4">
                <li className="grid gap-2">
                  <span className="">🔎 When you search for a product on Amazon, eBay, or Newegg, we:</span>
                  <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold">
                    PROCESS product identifier, image, link, name, price, reviews, stars and source
                  </code>
                  <span className="text-xs">
                    We use this to generate recommendations based on the products you search. Data is stored in memory
                    only.
                  </span>
                </li>

                <li className="grid gap-2">
                  <span className="">🤖 When generating a product recommendation, we:</span>
                  <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold">
                    PROCESS product identifier, name, price, reviews and stars
                  </code>
                  <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold">
                    UPDATE your account's history with the recommendation
                  </code>
                  <span className="text-xs">
                    We send the data to{" "}
                    <Link
                      className="font-semibold text-primary"
                      href="https://platform.openai.com/docs/api-reference/chat"
                    >
                      OpenAI’s Chat Completion API
                    </Link>{" "}
                    and then save the recommendation to your account's history
                  </span>
                </li>

                <li className="grid gap-2">
                  <span className="">🗝️ When you add your own OpenAI API key, we:</span>
                  <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold">
                    STORE the API key to localStorage
                  </code>
                  <span className="text-xs">
                    We read your API key from local storage when you add it to your account
                  </span>
                </li>
              </ul>
            </div>

            <h2 className="border-b pb-2 text-xl font-semibold tracking-tight transition-colors">
              Summary of personally identifying information:
            </h2>

            <div>
              <ul className="grid gap-4">
                <li className="grid gap-2">
                  <span className="">⚙️ When you manage your account/subscription:</span>
                  <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold">
                    UPDATE/DELETE the account information on our database
                  </code>
                  <span className="text-xs">
                    We allow you to modify/delete your account, name, email, password and subscription data through the
                    extension.
                  </span>
                </li>
              </ul>
            </div>

            <h2 className="border-b pb-2 text-xl font-semibold tracking-tight transition-colors">That's it!</h2>

            <div>
              In order to use the extension, you need an account. If you don't have an account, please create one{" "}
              <Link
                className="font-semibold text-primary"
                href={`${appwriteUrl}/privacy`}
                target={target}
                aria-label="Sign up"
              >
                here
              </Link>
              . For more information you can read our{" "}
              <Link
                className="font-semibold text-primary"
                href={`${appwriteUrl}/privacy`}
                target={target}
                aria-label="Privacy Policy"
              >
                Privacy Policy
              </Link>
            </div>
          </CardContent>

          <CardFooter className="grid grid-cols-2 gap-4">
            <Button variant="secondary" className="w-full">
              Uninstall extension
            </Button>
            <Button variant="default" className="w-full">
              Enable extension
            </Button>
          </CardFooter>
        </Card>

        <div className="mx-auto flex max-w-xl items-center justify-evenly pt-4">
          <Button variant="link" className="p-1" asChild>
            <Link
              className="text-base font-semibold"
              href={`${appwriteUrl}/terms`}
              target={target}
              aria-label="Terms and Conditions"
            >
              Terms and Conditions
            </Link>
          </Button>
          <Button variant="link" className="p-1" asChild>
            <Link
              className="text-base font-semibold"
              href={`${appwriteUrl}/privacy`}
              target={target}
              aria-label="Privacy Policy"
            >
              Privacy Policy
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

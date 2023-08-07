import browser from "webextension-polyfill";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Icons } from "@/components/ui/icons";
import { appwriteUrl } from "@/lib/envClient";

import "@/styles/globals.css";

import { useStorage } from "@plasmohq/storage/hook";
import Link from "next/link";

export default function Onboarding() {
  const [userAgreed, setUserAgreed] = useStorage<boolean>("userAgreed");

  function handleClose() {
    void window.close();
  }

  function handleUninstall() {
    void browser.management.uninstallSelf({
      showConfirmDialog: true,
    });
  }

  function handleEnable() {
    void setUserAgreed(true);
  }

  return (
    <div>
      <div className="p-4">
        <Link href={appwriteUrl} className="mx-auto flex max-w-2xl items-center justify-center gap-4 pb-4">
          <Icons.logo className="mt-2 h-12 w-12" aria-label="recommen.do logo" />

          <span className="text-4xl">recommen.do</span>
        </Link>

        <Card className="mx-auto max-w-2xl rounded-2xl shadow-2xl">
          {userAgreed ? (
            <>
              <CardHeader className="gap-2 text-center">
                <CardTitle>
                  <span className="text-2xl text-card-foreground">Setup successful!</span>
                </CardTitle>
              </CardHeader>

              <CardContent className="grid gap-4">
                <div>
                  Remember, this extension requires an account. If you don&apos;t have an account, please create one{" "}
                  <Link
                    className="font-semibold text-primary"
                    href={`${appwriteUrl}/sign-up`}
                    target="_blank"
                    aria-label="Sign up"
                  >
                    here
                  </Link>
                  . You can close this tab now.
                </div>
              </CardContent>

              <CardFooter className="grid gap-4">
                <Button type="button" variant="default" onClick={handleClose} className="w-full">
                  Close this tab
                </Button>
              </CardFooter>
            </>
          ) : (
            <>
              <CardHeader className="gap-2 text-center">
                <CardTitle>
                  <span className="text-lg text-card-foreground">Thanks for installing recommen.do extension!</span>
                </CardTitle>

                <CardDescription className="text-muted-foreground">
                  Your AI recommendations for shopping!
                </CardDescription>
              </CardHeader>

              <CardContent className="grid gap-4">
                <h2 className="border-b pb-2 text-xl font-semibold tracking-tight transition-colors">
                  Summary of personally identifying information:
                </h2>

                <div>
                  <div className="grid gap-4">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline">⚙️ When you manage your account or subscription</Button>
                      </DialogTrigger>

                      <DialogContent className="sm:max-w-[425px]">
                        <div className="grid gap-4">
                          <span className="">When you manage your account or subscription, we:</span>
                          <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold">
                            CREATE/UPDATE/DELETE the account information on our database
                          </code>
                          <span className="text-sm">
                            We allow you to create/modify/delete your account, name, email, password and subscription
                            data through the extension.
                          </span>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>

                <h2 className="border-b pb-2 text-xl font-semibold tracking-tight transition-colors">
                  Summary of technical or interaction data collected:
                </h2>

                <div>
                  <div className="grid gap-4">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline">🔎 When you search for a product on Amazon, eBay or Newegg</Button>
                      </DialogTrigger>

                      <DialogContent className="sm:max-w-[425px]">
                        <div className="grid gap-4">
                          <span className="">When you search for a product on Amazon, eBay or Newegg, we:</span>
                          <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold">
                            PROCESS product identifier, image, link, name, price, reviews, stars and source
                          </code>
                          <span className="text-sm">
                            We use this to generate recommendations based on the products you search for. Data is stored
                            in memory only.
                          </span>
                        </div>
                      </DialogContent>
                    </Dialog>

                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline">🤖 When generating a product recommendation</Button>
                      </DialogTrigger>

                      <DialogContent className="sm:max-w-[425px]">
                        <div className="grid gap-4">
                          <span className="">When generating a product recommendation, we:</span>
                          <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold">
                            PROCESS product identifier, name, price, reviews and stars
                          </code>
                          <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold">
                            UPDATE your account&apos;s history with the recommendation
                          </code>
                          <span className="text-sm">
                            We send the data to{" "}
                            <Link
                              className="font-semibold text-primary"
                              href="https://platform.openai.com/docs/api-reference/chat"
                            >
                              OpenAI&apos;s Chat Completion API
                            </Link>{" "}
                            and then save the recommendation to your account&apos;s history
                          </span>
                        </div>
                      </DialogContent>
                    </Dialog>

                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline">🗝️ When you add your own OpenAI API key</Button>
                      </DialogTrigger>

                      <DialogContent className="sm:max-w-[425px]">
                        <div className="grid gap-4">
                          <span className="">When you add your own OpenAI API key, we:</span>
                          <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold">
                            STORE the API key to localStorage
                          </code>
                          <span className="text-sm">
                            We read your API key from local storage to generate recommendations
                          </span>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>

                <h2 className="border-b pb-2 text-xl font-semibold tracking-tight transition-colors">
                  That&apos;s it!
                </h2>

                <div>
                  To use the extension, you need an account. If you don&apos;t have an account, please create one{" "}
                  <Link
                    className="font-semibold text-primary"
                    href={`${appwriteUrl}/sign-up`}
                    target="_blank"
                    aria-label="Sign up"
                  >
                    here
                  </Link>
                  . For more information you can read our{" "}
                  <Link
                    className="font-semibold text-primary"
                    href={`${appwriteUrl}/privacy`}
                    target="_blank"
                    aria-label="Privacy Policy"
                  >
                    Privacy Policy
                  </Link>
                </div>
              </CardContent>

              <CardFooter className="grid grid-cols-2 gap-4">
                <Button variant="secondary" onClick={handleUninstall} className="w-full">
                  Uninstall extension
                </Button>
                <Button type="button" variant="default" onClick={handleEnable} className="w-full">
                  Enable extension
                </Button>
              </CardFooter>
            </>
          )}
        </Card>

        <div className="mx-auto flex max-w-xl items-center justify-evenly pt-4">
          <Button variant="link" className="p-1" asChild>
            <Link
              className="text-base font-semibold"
              href={`${appwriteUrl}/terms`}
              target="_blank"
              aria-label="Terms and Conditions"
            >
              Terms and Conditions
            </Link>
          </Button>
          <Button variant="link" className="p-1" asChild>
            <Link
              className="text-base font-semibold"
              href={`${appwriteUrl}/privacy`}
              target="_blank"
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

import type { Metadata } from "next";

import Image from "next/image";
import Link from "next/link";

import DownloadButton from "@/components/layout/download-button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Icons } from "@/components/ui/icons";

export const metadata: Metadata = {
  title: "Installation Guide",
};

export default function InstallationPage() {
  return (
    <section id="installation_page">
      <div className="mx-auto flex max-w-7xl flex-col gap-y-8 p-4">
        <div className="grid gap-4">
          <h1 className="text-3xl font-semibold">Get started</h1>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div className="">
              <Card className="relative grid p-4 lg:p-0">
                <CardHeader>
                  <CardTitle className="text-xl font-light">
                    <div className="flex items-center justify-center gap-4">
                      <div className="absolute left-4 top-4 flex h-8 w-8 items-center justify-center rounded-full border border-muted-foreground/70 text-base font-medium text-muted-foreground">
                        <span>1</span>
                      </div>
                      Install the extension
                    </div>
                  </CardTitle>
                </CardHeader>

                <CardFooter className="grid justify-center">
                  <DownloadButton size="lg" />
                </CardFooter>
              </Card>
            </div>
            <div className="">
              <Card className="relative grid p-4 lg:p-0">
                <CardHeader>
                  <CardTitle className="text-xl font-light">
                    <div className="flex items-center justify-center gap-4">
                      <div className="absolute left-4 top-4 flex h-8 w-8 items-center justify-center rounded-full border border-muted-foreground/70 text-base font-medium text-muted-foreground">
                        <span>2</span>
                      </div>
                      Create an account
                    </div>
                  </CardTitle>
                </CardHeader>

                <CardFooter className="grid">
                  <Button variant="outline" size="lg" asChild>
                    <Link href="/sign-up">
                      <Icons.sprout className="mr-2 mt-1 h-6 w-6 text-primary" aria-hidden="true" />
                      Sign up
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            </div>
            <div className="col-span-1 md:col-span-2 lg:col-span-1">
              <Card className="relative grid p-4 lg:p-0">
                <CardHeader>
                  <CardTitle className="text-xl font-light">
                    <div className="flex items-center justify-center gap-4">
                      <div className="absolute left-4 top-4 flex h-8 w-8 items-center justify-center rounded-full border border-muted-foreground/70 text-base font-medium text-muted-foreground">
                        <span>3</span>
                      </div>
                      Get recommendations
                    </div>
                  </CardTitle>
                </CardHeader>

                <CardFooter className="grid grid-cols-3 gap-2">
                  <Button variant="ghost" className="" size="lg" asChild>
                    <Link href="https://www.amazon.com/s?k=smartphone">Amazon</Link>
                  </Button>
                  <Button variant="ghost" className="" size="lg" asChild>
                    <Link href="https://www.newegg.com/p/pl?d=graphics+card">Newegg</Link>
                  </Button>
                  <Button variant="ghost" className="" size="lg" asChild>
                    <Link href="https://www.ebay.com/sch/i.html?_nkw=laptop">Ebay</Link>
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </div>

        <div className="grid gap-4">
          <h2 className="text-2xl font-semibold">Guides</h2>

          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger className="text-left">Use your own API key</AccordionTrigger>
              <AccordionContent>
                <div className="flex flex-col gap-4 lg:flex-row">
                  <div>
                    <Image
                      src="/installation/usage-32.png"
                      width={383}
                      height={636}
                      className="mx-auto rounded-lg lg:mx-0"
                      alt="Instructional image for entering API key in recommen.do settings"
                    />
                  </div>
                  <div>
                    <p className="pb-1">
                      If you have your own OpenAI API key, you can set it up in the extension&quot;s popup page.
                    </p>
                    <p>- Click the extension&quot;s icon in the toolbar.</p>
                    <p>- Look for the &quot;API Key&quot; option in theSettings section of the extension.</p>
                    <p>- Enter your API key and save the settings.</p>
                    <p>- Using your own API key allows free usage of the extension. The key is stored locally.</p>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2">
              <AccordionTrigger className="text-left">Refill recommendations</AccordionTrigger>
              <AccordionContent>
                <div className="flex flex-col gap-4 lg:flex-row">
                  <div>
                    <Image
                      src="/installation/usage-44.png"
                      width={450}
                      height={197}
                      className="mx-auto rounded-lg lg:mx-0"
                      alt="Guide image for refilling recommendations in recommen.do settings"
                    />
                  </div>
                  <div>
                    <p className="pb-1">
                      If you have an active subscription, you can add more recommendations. These recommendations will
                      expire at the end of your current billing cycle.
                    </p>
                    <p>- Visit the extension&quot;s Account tab or go to your profile page on recommen.do.</p>
                    <p>
                      - Click the &quot;Add 50 more recommendations&quot; button located in the Usage section and follow
                      the payment instructions.
                    </p>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3">
              <AccordionTrigger className="text-left">Update plan</AccordionTrigger>
              <AccordionContent>
                <div className="flex flex-col gap-4 lg:flex-row">
                  <div>
                    <Image
                      src="/installation/usage-45.png"
                      width={450}
                      height={267}
                      className="mx-auto rounded-lg lg:mx-0"
                      alt="Image tutorial for updating plan in recommen.do account"
                    />
                  </div>
                  <div>
                    <p className="pb-1">
                      To update your subscription plan you can use the &quot;Manage Subscription&quot; button. The
                      button can be accessed from one of the following areas:
                    </p>
                    <p>
                      - Pricing area on the recommen.do website:{" "}
                      <Link className="text-primary" href="/#pricing">
                        recommen.do/#pricing
                      </Link>
                    </p>
                    <p>- Subscription section located in the Account section of the recommen.do extension</p>
                    <p>- Subscription section located in your profile page on recommen.do</p>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </section>
  );
}

"use client";

import BrowserDetector from "browser-dtector";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { browserDetails } from "@/lib/config/browser";

export function Hero() {
  const [browser, setBrowser] = useState<BrowserDetector>();

  useEffect(() => {
    const browser = new BrowserDetector(window.navigator.userAgent);
    setBrowser(browser);
  }, []);

  const parsedUA = browser?.parseUserAgent();
  const browserName = parsedUA?.name;
  const browserInfo = browserDetails.find((browser) => browser.name === browserName);

  return (
    <section id="home" className="overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.75, ease: "easeOut" }}
        viewport={{ once: true }}
        className="mx-auto max-w-7xl px-4 py-8 lg:py-16"
      >
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-14 xl:gap-20">
          <div>
            <h1 className="text-3xl font-bold tracking-tighter md:text-4xl lg:text-5xl">
              Your <span className="heading-accent">AI-Powered</span> Shopping Companion
            </h1>

            <p className="mt-4 text-base lg:mt-6 lg:text-lg">
              Get personalized shopping recommendations with recommen.do
            </p>

            <div className="mt-8 grid w-full gap-4 lg:mt-12 lg:inline-flex">
              {browserInfo ? (
                <Button variant="default" size="lg" aria-label={browserInfo.ariaLabel} asChild>
                  <Link href={browserInfo.href}>{browserInfo.description}</Link>
                </Button>
              ) : (
                <Button variant="default" size="lg" aria-label="Get extension for Chrome" asChild>
                  <Link href="https://chrome.google.com/webstore/detail/ai-recommendations-for-sh/obfbgdconmhiolihlenkaopigkpeblne">
                    Get extension for Chrome
                  </Link>
                </Button>
              )}
              <Button variant="outline" size="lg" asChild>
                <Link href="#pricing" aria-label="View pricing">
                  View pricing
                </Link>
              </Button>
            </div>

            <div className="[&>*]:browser-accent mt-8 grid grid-cols-3 items-center justify-center gap-6 md:grid-cols-3 lg:mt-12 lg:grid-cols-3 xl:grid-cols-6">
              <Image src="/browsers/chrome.svg" width={64} height={64} alt="Download extension for Chrome browser" />
              <Image src="/browsers/edge.svg" width={64} height={64} alt="Download extension for Edge browser" />
              <Image src="/browsers/firefox.svg" width={64} height={64} alt="Download extension for Firefox browser" />
              <Image src="/browsers/brave.svg" width={64} height={64} alt="Download extension for Brave browser" />
              <Image src="/browsers/opera.svg" width={64} height={64} alt="Download extension for Opera browser" />
              <Image src="/browsers/vivaldi.svg" width={64} height={64} alt="Download extension for Vivaldi browser" />
            </div>
          </div>
          <div className="lg:w-[58rem]">
            <Image
              className="w-full rounded-xl shadow-xl"
              src="/frontpage/hero-img.png"
              height={1478}
              width={1060}
              alt="Screenshot with recommen.do extension displayed"
              priority
            />
          </div>
        </div>
      </motion.div>
    </section>
  );
}

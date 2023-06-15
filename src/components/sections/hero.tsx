"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { browserName } from "react-device-detect";

import { Button } from "~/components/ui/button";

export function Hero() {
  const [browser, setBrowser] = useState("");
  const unsupportedBrowser = browser !== "Chrome" && browser !== "Edge";

  useEffect(() => {
    setBrowser(browserName);
  }, []);

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
            <h1 className="text-3xl font-bold md:text-4xl md:leading-tight xl:text-5xl">
              Your <span className="heading-accent">AI-Powered</span> Shopping Companion
            </h1>

            <p className="mt-4 text-base lg:mt-6 lg:text-lg">
              Get personalized shopping recommendations with OpenAI GPT
            </p>

            <div className="mt-10 grid w-full gap-4 md:inline-flex lg:mt-16">
              <Button variant="default" className="px-4 py-6 text-base" disabled={unsupportedBrowser}>
                {unsupportedBrowser ? (
                  <a href="#">Not yet supported</a>
                ) : (
                  <a href="/chrome-1.0.0.zip">
                    Download <span className="hidden lg:inline-flex">extension for free</span>
                  </a>
                )}
              </Button>
              <Button variant="outline" className="px-4 py-6 text-base text-primary" asChild>
                <Link href="/#features">See features</Link>
              </Button>
            </div>

            <div className="[&>*]:browser-accent mt-10 grid grid-cols-4 items-center justify-center gap-6 md:grid-cols-8 lg:mt-16 lg:grid-cols-4 xl:grid-cols-8">
              <a href="/chrome-1.0.0.zip">
                <Image src="/Chrome.svg" width={64} height={64} alt="Download extension for Chrome browser" />
              </a>
              <a href="/chrome-1.0.0.zip">
                <Image src="/Edge.svg" width={64} height={64} alt="Download extension for Edge browser" />
              </a>

              <Image
                src="/Firefox.svg"
                width={64}
                height={64}
                alt="Download extension for Firefox browser"
                className="opacity-50"
              />
              <Image
                src="/Safari.svg"
                width={64}
                height={64}
                alt="Download extension for Safari browser"
                className="opacity-50"
              />
              <Image
                src="/Brave.svg"
                width={64}
                height={64}
                alt="Download extension for Brave browser"
                className="opacity-50"
              />
              <Image
                src="/Opera.svg"
                width={64}
                height={64}
                alt="Download extension for Opera browser"
                className="opacity-50"
              />
              <Image
                src="/Duck.svg"
                width={64}
                height={64}
                alt="Download extension for DuckDuckGo browser"
                className="opacity-50"
              />
              <Image
                src="/Vivaldi.svg"
                width={64}
                height={64}
                alt="Download extension for Vivaldi browser"
                className="opacity-50"
              />
            </div>
          </div>
          <div className="w-[60rem]">
            <Image
              className="w-full rounded-2xl shadow-xl"
              src="/hero-img.png"
              height={1478}
              width={1060}
              alt="Screenshot with recommen.do extension displayed"
            />
          </div>
        </div>
      </motion.div>
    </section>
  );
}

"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { browserName } from "react-device-detect";

import { Button } from "@/components/ui/button";

export function Hero() {
  const [browser, setBrowser] = useState("");
  const isChromium = browser !== "Firefox" && browser !== "Safari";

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
            <h1 className="text-3xl font-bold tracking-tighter md:text-4xl lg:text-5xl">
              Your <span className="heading-accent">AI-Powered</span> Shopping Companion
            </h1>

            <p className="mt-4 text-base lg:mt-6 lg:text-lg">
              Get personalized shopping recommendations with recommen.do
            </p>

            <div className="mt-8 grid w-full gap-4 lg:mt-12 lg:inline-flex">
              <Button variant="default" size="lg" asChild>
                {isChromium ? (
                  <a href="/download/chrome-1.1.0.zip" aria-label={`Download extension for ${browser}`}>
                    Download <span className="ml-1 hidden lg:inline-flex">extension for {browser}</span>
                  </a>
                ) : (
                  <a href="/download/firefox-1.1.0.zip" aria-label={`Download extension for ${browser}`}>
                    Download <span className="ml-1 hidden lg:inline-flex">extension for {browser}</span>
                  </a>
                )}
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="#pricing" aria-label="View pricing">
                  View pricing
                </Link>
              </Button>
            </div>

            <div className="[&>*]:browser-accent mt-8 grid grid-cols-3 items-center justify-center gap-6 md:grid-cols-3 lg:mt-12 lg:grid-cols-3 xl:grid-cols-6">
              <Image src="/browsers/Chrome.svg" width={64} height={64} alt="Download extension for Chrome browser" />
              <Image src="/browsers/Edge.svg" width={64} height={64} alt="Download extension for Edge browser" />

              <Image src="/browsers/Firefox.svg" width={64} height={64} alt="Download extension for Firefox browser" />
              {/* <Image
                src="/browsers/Safari.svg"
                width={64}
                height={64}
                alt="Download extension for Safari browser"
                className="opacity-50"
              /> */}
              <Image src="/browsers/Brave.svg" width={64} height={64} alt="Download extension for Brave browser" />
              <Image src="/browsers/Opera.svg" width={64} height={64} alt="Download extension for Opera browser" />
              {/* <Image src="/browsers/Duck.svg" width={64} height={64} alt="Download extension for DuckDuckGo browser" /> */}
              <Image src="/browsers/Vivaldi.svg" width={64} height={64} alt="Download extension for Vivaldi browser" />
            </div>
          </div>
          <div className="lg:w-[58rem]">
            <Image
              className="w-full rounded-xl shadow-xl"
              src="/frontpage/hero-img.png"
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

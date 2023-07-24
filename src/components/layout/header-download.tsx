"use client";

import BrowserDetector from "browser-dtector";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { browserDetails } from "@/lib/config/browser";

export default function HeaderDownload() {
  const [browser, setBrowser] = useState<BrowserDetector>();

  useEffect(() => {
    const browser = new BrowserDetector(window.navigator.userAgent);
    setBrowser(browser);
  }, []);

  const parsedUA = browser?.parseUserAgent();
  const browserName = parsedUA?.name;
  const browserInfo = browserDetails.find((browser) => browser.name === browserName);

  return (
    <div className="relative items-center">
      {browserInfo ? (
        <>
          <Image
            className="absolute -left-4 -top-1 rounded-full bg-white/60 p-1 backdrop-blur-lg"
            src={`/browsers/${browserInfo.short}.svg`}
            width={46}
            height={46}
            alt={`Download extension for ${browserInfo.name} browser`}
          />
          <Button variant="default" aria-label={browserInfo.ariaLabel} className="pl-9" asChild>
            <Link href={browserInfo.href}>{browserInfo.description}</Link>
          </Button>
        </>
      ) : (
        <>
          <Image
            className="absolute -left-4 -top-1 rounded-full bg-white/60 p-1 backdrop-blur-lg"
            src="/browsers/chrome.svg"
            width={46}
            height={46}
            alt="Download extension for Google Chrome browser"
          />
          <Button variant="default" aria-label="Get extension for Chrome" className="pl-9" asChild>
            <Link href="https://chrome.google.com/webstore/detail/ai-recommendations-for-sh/obfbgdconmhiolihlenkaopigkpeblne">
              Get extension for Chrome
            </Link>
          </Button>
        </>
      )}
    </div>
  );
}

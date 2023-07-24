"use client";

import BrowserDetector from "browser-dtector";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { browserDetails } from "@/lib/config/browser";

export default function DownloadButton({ size = "default" }: { size?: "default" | "lg" }) {
  const [browser, setBrowser] = useState<BrowserDetector>();

  useEffect(() => {
    const browser = new BrowserDetector(window.navigator.userAgent);
    setBrowser(browser);
  }, []);

  const parsedUA = browser?.parseUserAgent();
  const browserName = parsedUA?.name;
  const browserInfo = browserDetails.find((browser) => browser.name === browserName);

  return (
    <div className="relative ml-4 grid items-center">
      {browserInfo ? (
        <>
          <Image
            className="absolute -left-4 -top-0.5 rounded-full bg-white/60 p-1 backdrop-blur-lg"
            src={`/browsers/${browserInfo.short}.svg`}
            width={size === "default" ? 46 : 54}
            height={size === "default" ? 46 : 54}
            alt={`Download extension for ${browserInfo.name} browser`}
          />
          <Button
            variant="default"
            size={size}
            aria-label={browserInfo.ariaLabel}
            className={size === "default" ? "pl-9" : "pl-11"}
            asChild
          >
            <Link href={browserInfo.href}>{browserInfo.description}</Link>
          </Button>
        </>
      ) : (
        <>
          <Image
            className="absolute -left-4 -top-0.5 rounded-full bg-white/60 p-1 backdrop-blur-lg"
            src="/browsers/chrome.svg"
            width={size === "default" ? 46 : 54}
            height={size === "default" ? 46 : 54}
            alt="Download extension for Google Chrome browser"
          />
          <Button
            variant="default"
            size={size}
            aria-label="Get extension for Chrome"
            className={size === "default" ? "pl-9" : "pl-11"}
            asChild
          >
            <Link href="https://chrome.google.com/webstore/detail/ai-recommendations-for-sh/obfbgdconmhiolihlenkaopigkpeblne">
              Get extension for Chrome
            </Link>
          </Button>
        </>
      )}
    </div>
  );
}

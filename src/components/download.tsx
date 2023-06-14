"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { browserName } from "react-device-detect";

import { Button } from "~/components/ui/button";

export default function Download() {
  const [browser, setBrowser] = useState("");

  useEffect(() => {
    setBrowser(browserName);
  }, []);

  return (
    <div className="relative items-center">
      {browser && (
        <Image
          className="absolute -left-4 -top-1 rounded-full bg-white/60 p-1 backdrop-blur-lg"
          src={`/${browser}.svg`}
          width={46}
          height={46}
          alt={`Download extension for ${browser} browser`}
        />
      )}
      <Button variant="default" className={browser ? "pl-9" : ""}>
        <a href={browser === "Firefox" ? "/firefox.zip" : "/chrome.zip"}>
          Download <span className="hidden lg:inline-flex">extension for free</span>
        </a>
      </Button>
    </div>
  );
}

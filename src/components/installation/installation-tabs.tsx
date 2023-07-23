"use client";

import BrowserDetector from "browser-dtector";
import Image from "next/image";
import { useEffect, useState } from "react";

import InstallationChrome from "@/components/installation/installation-chrome";
import InstallationEdge from "@/components/installation/installation-edge";
import InstallationFirefox from "@/components/installation/installation-firefox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

function InstallationTabs() {
  const [result, setResult] = useState("Google Chrome");

  useEffect(() => {
    const browser = new BrowserDetector(window.navigator.userAgent);
    const supportedBrowsers = ["Google Chrome", "Mozilla Firefox", "Microsoft Edge", "Brave", "Opera", "Vivaldi"];

    const parsedUA = browser?.parseUserAgent();
    const browserName = parsedUA?.name;

    if (typeof browserName === "string" && supportedBrowsers.includes(browserName)) {
      setResult(browserName);
    }
  }, []);

  return (
    <Tabs value={result} onValueChange={(value) => setResult(value)} className="space-y-4">
      <TabsList className="grid h-auto w-full grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
        <TabsTrigger value="Google Chrome" className="flex items-center gap-x-2 py-3 data-[state=inactive]:grayscale">
          <Image src="/browsers/chrome.svg" width={20} height={20} alt="Download extension for Chrome browser" />
          <p className="text-base">Google Chrome</p>
        </TabsTrigger>
        <TabsTrigger value="Mozilla Firefox" className="flex items-center gap-x-2 py-3 data-[state=inactive]:grayscale">
          <Image src="/browsers/firefox.svg" width={20} height={20} alt="Download extension for Firefox browser" />
          <p className="text-base">Mozilla Firefox</p>
        </TabsTrigger>
        <TabsTrigger value="Microsoft Edge" className="flex items-center gap-x-2 py-3 data-[state=inactive]:grayscale">
          <Image src="/browsers/edge.svg" width={20} height={20} alt="Download extension for Edge browser" />
          <p className="text-base">Microsoft Edge</p>
        </TabsTrigger>
        <TabsTrigger value="Brave" className="flex items-center gap-x-2 py-3 data-[state=inactive]:grayscale">
          <Image src="/browsers/brave.svg" width={20} height={20} alt="Download extension for Brave browser" />
          <p className="text-base">Brave</p>
        </TabsTrigger>
        <TabsTrigger value="Opera" className="flex items-center gap-x-2 py-3 data-[state=inactive]:grayscale">
          <Image src="/browsers/opera.svg" width={20} height={20} alt="Download extension for Opera browser" />
          <p className="text-base">Opera</p>
        </TabsTrigger>
        <TabsTrigger value="Vivaldi" className="flex items-center gap-x-2 py-3 data-[state=inactive]:grayscale">
          <Image src="/browsers/vivaldi.svg" width={20} height={20} alt="Download extension for Vivaldi browser" />
          <p className="text-base">Vivaldi</p>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="Google Chrome">
        <InstallationChrome />
      </TabsContent>
      <TabsContent value="Mozilla Firefox">
        <InstallationFirefox />
      </TabsContent>
      <TabsContent value="Microsoft Edge">
        <InstallationEdge />
      </TabsContent>
      <TabsContent value="Brave">
        <InstallationChrome />
      </TabsContent>
      <TabsContent value="Opera">
        <InstallationChrome />
      </TabsContent>
      <TabsContent value="Vivaldi">
        <InstallationChrome />
      </TabsContent>
    </Tabs>
  );
}

export default InstallationTabs;

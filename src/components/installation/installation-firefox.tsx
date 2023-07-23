"use client";

import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";

function InstallationFirefox() {
  return (
    <div className="mx-auto">
      <ul className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <li className="grid grid-rows-[auto_1fr] gap-4">
          <div className="flex items-center justify-center gap-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-full border-2">
              <span>1</span>
            </div>
            <h3>Click the button</h3>
          </div>
          <div className="place-self-center">
            <Button variant="default" size="lg" aria-label="Get extension from Mozilla Add-ons" asChild>
              <Link href="https://addons.mozilla.org/en-US/firefox/addon/recommen-do/">
                Get extension from Mozilla Add-ons
              </Link>
            </Button>
          </div>
        </li>
        <li className="grid grid-rows-[auto_1fr] gap-4">
          <div className="flex items-center justify-center gap-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-full border-2">
              <span>2</span>
            </div>
            <h3>Install extension from Mozilla Add-ons</h3>
          </div>
          <div className="place-self-center">
            <Image
              className="w-full rounded-xl shadow-xl"
              src="/installation/firefox-page.png"
              width={1143}
              height={626}
              alt="Screenshot with recommen.do download extension button"
            />
          </div>
        </li>
        <li className="grid grid-rows-[auto_1fr] gap-4">
          <div className="flex items-center justify-center gap-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-full border-2">
              <span>3</span>
            </div>
            <h3>Confirm</h3>
          </div>
          <div className="place-self-center">
            <Image
              className="w-full rounded-xl shadow-xl"
              src="/installation/firefox-confirm.png"
              width={409}
              height={155}
              alt="Screenshot with confirm extension installation"
            />
          </div>
        </li>
      </ul>
    </div>
  );
}

export default InstallationFirefox;

"use client";

import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";

function InstallationChrome() {
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
            <Button variant="default" size="lg" aria-label="Get extension from Chrome Web Store" asChild>
              <Link href="https://chrome.google.com/webstore/detail/ai-recommendations-for-sh/obfbgdconmhiolihlenkaopigkpeblne">
                Get extension from Chrome Web Store
              </Link>
            </Button>
          </div>
        </li>
        <li className="grid grid-rows-[auto_1fr] gap-4">
          <div className="flex items-center justify-center gap-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-full border-2">
              <span>2</span>
            </div>
            <h3>Install extension from Chrome Web Store</h3>
          </div>
          <div className="place-self-center">
            <Image
              className="w-full rounded-xl shadow-xl"
              src="/installation/chrome-page.png"
              width={1029}
              height={687}
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
              src="/installation/chrome-confirm.png"
              width={456}
              height={207}
              alt="Screenshot with confirm extension installation"
            />
          </div>
        </li>
      </ul>
    </div>
  );
}

export default InstallationChrome;

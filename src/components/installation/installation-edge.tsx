"use client";

import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";

function InstallationEdge() {
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
            <Button variant="default" size="lg" aria-label="Get extension from Edge Add-ons" asChild>
              <Link href="https://microsoftedge.microsoft.com/addons/detail/recommendo/pdahoiahedcdggmdopbgefclpcpeiioc">
                Get extension from Edge Add-ons
              </Link>
            </Button>
          </div>
        </li>
        <li className="grid grid-rows-[auto_1fr] gap-4">
          <div className="flex items-center justify-center gap-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-full border-2">
              <span>2</span>
            </div>
            <h3>Install extension from Edge Add-ons</h3>
          </div>
          <div className="place-self-center">
            <Image
              className="w-full rounded-xl shadow-xl"
              src="/installation/edge-page.png"
              width={1019}
              height={635}
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
              src="/installation/edge-confirm.png"
              width={465}
              height={183}
              alt="Screenshot with confirm extension installation"
            />
          </div>
        </li>
      </ul>
    </div>
  );
}

export default InstallationEdge;

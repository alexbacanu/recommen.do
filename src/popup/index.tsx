import { Init } from "~/components/layout/init";
import { Account } from "~/components/tabs/account";
import { History } from "~/components/tabs/history";
import { Local } from "~/components/tabs/local";
import { Subscription } from "~/components/tabs/subscription";

import "~/styles/globals.css";

export default function IndexPopup() {
  return (
    <>
      <Init />
      <Account />
      <History />
      <Subscription />
      <Local />
    </>
  );
}

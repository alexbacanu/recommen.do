import { Account } from "~/components/tabs/account";
import { History } from "~/components/tabs/history";
import { Local } from "~/components/tabs/local";
import { Subscription } from "~/components/tabs/subscription";

export default function ProfilePage() {
  return (
    <>
      <Account />
      <History />
      <Subscription />
      <Local />
    </>
  );
}

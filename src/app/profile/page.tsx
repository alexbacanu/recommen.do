import { Account } from "~/components/tabs/account";
import { Alerts } from "~/components/tabs/alerts";
import { History } from "~/components/tabs/history";
import { Local } from "~/components/tabs/local";
import { Subscription } from "~/components/tabs/subscription";

export default function ProfilePage() {
  return (
    <>
      <section id="profile_page" className="overflow-hidden">
        <div className="mx-auto max-w-7xl py-5">
          <Alerts />
          <Subscription />
          <Account />
          <History />
          <Local />
        </div>
      </section>
    </>
  );
}

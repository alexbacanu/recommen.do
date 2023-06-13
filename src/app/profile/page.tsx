import { Dashboard } from "~/components/layout/dashboard";

export default function ProfilePage() {
  return (
    // <section id="profile_page" className="overflow-hidden">
    //   <div className="mx-auto flex max-w-7xl flex-col gap-y-5 px-2 py-5">
    //     <AuthProtect>
    //       <Alerts />
    //       <Subscription />
    //       <Account />
    //     </AuthProtect>
    //   </div>
    // </section>

    <section id="profile_page">
      {/* <Init /> */}
      <Dashboard />
    </section>
  );
}

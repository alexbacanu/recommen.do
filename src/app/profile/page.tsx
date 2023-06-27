import { Dashboard } from "@/components/profile/dashboard";

export default function ProfilePage() {
  return (
    <section id="profile_page">
      <div className="mx-auto flex max-w-7xl flex-col gap-y-4 p-4">
        <Dashboard />
      </div>
    </section>
  );
}

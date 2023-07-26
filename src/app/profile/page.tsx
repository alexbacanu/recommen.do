import type { Metadata } from "next";

import { Dashboard } from "@/components/profile/dashboard";

export const metadata: Metadata = {
  title: "Your profile",
};

export default function ProfilePage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <Dashboard />
    </div>
  );
}

import InstallationTabs from "@/components/installation/installation-tabs";

import Installation from "./installation.mdx";

export default function InstallationPage() {
  return (
    <section id="installation_page">
      <div className="mx-auto flex max-w-7xl flex-col gap-y-4 p-4">
        <h1 className="text-3xl font-semibold">Extension Usage Instructions</h1>
        <h2 className="text-2xl font-semibold">Step 1: Install the Extension</h2>
        <InstallationTabs />
        <Installation />
      </div>
    </section>
  );
}

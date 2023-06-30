import { CardAPIKey } from "@/components/profile/card-apikey";
import { CardHistory } from "@/components/profile/card-history";
import { CardSupport } from "@/components/profile/card-support";
import { CardUsage } from "@/components/profile/card-usage";
import { Card } from "@/components/ui/card";

export function Dashboard() {
  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <Card>
        {/* <CardAccount /> */}

        <CardUsage />

        <CardAPIKey />

        <CardSupport />
      </Card>
      <Card>
        <CardHistory />
      </Card>
    </div>
  );
}

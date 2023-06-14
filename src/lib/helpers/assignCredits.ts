import { stripeBasicPlan, stripePremiumPlan, stripeUltimatePlan } from "~/lib/envServer";

const assignCredits = (plan?: string) => {
  const planMap: Record<string, number> = {
    [stripeBasicPlan]: 50,
    [stripePremiumPlan]: 200,
    [stripeUltimatePlan]: 600,
  };

  return planMap[plan || ""] || 0;
};

export { assignCredits };

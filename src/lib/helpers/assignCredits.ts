import { stripeBasicPlan, stripePremiumPlan, stripeUltimatePlan } from "~/lib/envServer";

const assignCredits = (plan?: string) => {
  const planMap: Record<string, number> = {
    [stripeBasicPlan]: 50,
    [stripePremiumPlan]: 200,
    [stripeUltimatePlan]: 600,
  };

  if (plan && plan in planMap) {
    return planMap[plan];
  } else {
    return 0;
  }
};

export { assignCredits };

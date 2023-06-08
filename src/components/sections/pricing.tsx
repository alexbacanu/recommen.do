interface PricingProps {
  plans: {
    id: string;
    name: string;
    price: number;
    interval: string | undefined;
    currency: string;
    description: string | null;
  }[];
}

export function Pricing({ plans }: PricingProps) {
  return (
    <section className="placeholder py-24">
      <h2 className="text-2xl">Plans</h2>
      <div className="flex justify-between">
        {plans.map((plan) => (
          <div key={plan.id}>
            <h3>{plan.name}</h3>
            <p>
              ${plan.price} / {plan.interval}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

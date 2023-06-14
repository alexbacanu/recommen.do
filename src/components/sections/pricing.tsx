"use client";

import type { Variants } from "framer-motion";

import { motion } from "framer-motion";
import { useAtomValue } from "jotai";
import Link from "next/link";

import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "~/components/ui/card";
import { Label } from "~/components/ui/label";
import { accountAtom, profileAtom } from "~/lib/atoms/appwrite";
import { useAppwrite } from "~/lib/helpers/useAppwrite";

interface PricingProps {
  plans: {
    priceId: string;
    name: string;
    price: number;
    interval: string | undefined;
    currency: string;
    description: string | null;
    metadata: {
      features: string;
    };
  }[];
}

export function Pricing({ plans }: PricingProps) {
  const container: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.75,
        ease: "easeOut",
        delayChildren: 0.2,
        staggerChildren: 0.2,
      },
    },
  };

  const left: Variants = {
    hidden: { x: -60 },
    visible: {
      x: 0,
      transition: {
        ease: "easeOut",
      },
    },
  };

  const zoom: Variants = {
    hidden: { scale: 0.95 },
    visible: {
      scale: 1,
      transition: {
        ease: "easeOut",
      },
    },
  };

  const { createJWT } = useAppwrite();
  const account = useAtomValue(accountAtom);
  const profile = useAtomValue(profileAtom);

  // console.log("account:", account);
  // console.log("profile:", profile);

  const showSubscribe = profile && !profile.stripeSubscriptionId;
  const showManage = profile && profile.stripeSubscriptionId;

  let jwt: string;

  const handleSubscribe = async (priceId: string) => {
    if (!jwt) {
      const jwtToken = await createJWT();
      jwt = jwtToken.jwt;
    }

    // console.log("jwt:", jwt);

    const getCheckoutURL = await fetch(`/api/stripe/subscription/${priceId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });

    const checkoutUrl = await getCheckoutURL.json();

    // console.log("getCheckoutURL:", checkoutUrl);
    window.open(checkoutUrl.url, "_blank", "noopener,noreferrer");
  };

  return (
    <>
      {/* <section className="placeholder py-24">
        <h2 className="text-2xl">Plans</h2>
        <div className="flex justify-between">
          {plans.map((plan) => (
            <div key={plan.priceId}>
              <h3>{plan.name}</h3>
              <p>
                ${plan.price} / {plan.interval}
              </p>
              {showCreateAccountButton && <div className="rounded-md bg-red-500">Create Account</div>}
              {showSubscribeButton && (
                <button onClick={() => handleSubscribe(plan.priceId)} className="rounded-md bg-red-500">
                  Subscribe
                </button>
              )}
              {showManageSubscriptionButton && (
                <button onClick={() => handleSubscribe(plan.priceId)} className="rounded-md bg-red-500">
                  Manage subscription
                </button>
              )}
              {showManageSubscriptionButton && (
                <button onClick={() => handleRefill()} className="rounded-md bg-red-500">
                  Add 50 credits
                </button>
              )}
            </div>
          ))}
        </div>
      </section> */}
      <section id="pricing" className="overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 py-8 lg:py-16">
          <div className="flex flex-col gap-y-10 lg:gap-y-12 xl:gap-y-14">
            <h2 className="heading-accent text-center">Simple, transparent pricing</h2>

            <Card className="flex items-center justify-between gap-x-2 p-6 md:gap-x-6">
              <div className="flex items-center gap-x-2 md:gap-x-6">
                <Label className="text-lg uppercase">Free</Label>
                <Label className="text-center text-sm md:text-base">10 free recommendations on account creation</Label>
              </div>
              <div className="flex items-center gap-x-2 md:gap-x-6">
                <Button variant="outline" className="whitespace-nowrap">
                  Get started
                </Button>
                <Label className="text-base">0$ / month</Label>
              </div>
            </Card>

            <motion.div
              variants={container}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-1 gap-x-4 gap-y-6 lg:grid-cols-3 lg:gap-x-8"
            >
              {plans.map((plan, index) => (
                <motion.div key={plan.priceId} variants={zoom} viewport={{ once: true }}>
                  <Card className={index === 1 ? "border-ring" : ""}>
                    <CardHeader>
                      <CardTitle className="flex items-start justify-between">
                        {plan.name}
                        <Badge variant="outline">Free in beta</Badge>
                      </CardTitle>
                      <CardDescription>{plan.price}$ / month</CardDescription>
                    </CardHeader>
                    <CardContent className="grid">
                      {!account ? (
                        <Button asChild variant={index === 1 ? "default" : "outline"}>
                          <Link href="https://recommendo.authui.site/">Get started</Link>
                        </Button>
                      ) : (
                        <Button
                          variant={index === 1 ? "default" : "outline"}
                          onClick={() => handleSubscribe(plan.priceId)}
                        >
                          {showSubscribe && "Subscribe"}
                          {showManage && "Manage subscription"}
                        </Button>
                      )}
                    </CardContent>
                    <CardFooter>
                      <div className="flex flex-col gap-y-4">
                        {plan.metadata.features &&
                          plan.metadata.features.split(",").map((feature, index) => (
                            <div
                              key={index}
                              className="flex items-center gap-x-2 text-muted-foreground first:text-card-foreground"
                            >
                              <span className="flex h-2 w-2 translate-y-1 rounded-full bg-sky-500" />
                              <p className="text-sm font-medium leading-none">{feature}</p>
                            </div>
                          ))}
                      </div>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}

              {/* <motion.div variants={zoom} viewport={{ once: true }}>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-start justify-between">
                      <Label>Pro</Label>
                      <Badge variant="outline">Free during beta</Badge>
                    </CardTitle>
                    <CardDescription>5$ / month</CardDescription>
                  </CardHeader>
                  <CardContent className="grid">
                    <Button>Get started</Button>
                  </CardContent>
                  <CardFooter>
                    <div className="flex flex-col gap-y-4">
                      <div className="flex items-center gap-x-2">
                        <span className="flex h-2 w-2 translate-y-1 rounded-full bg-sky-500" />
                        <p className="text-sm font-medium leading-none">50 recommendations / month</p>
                      </div>
                      <div className="flex items-center gap-x-2">
                        <span className="flex h-2 w-2 translate-y-1 rounded-full bg-sky-500" />
                        <p className="text-sm font-medium leading-none">No need for an API key</p>
                      </div>
                      <div className="flex items-center gap-x-2">
                        <span className="flex h-2 w-2 translate-y-1 rounded-full bg-sky-500" />
                        <span className="text-xs text-muted-foreground">Soon™</span>
                        <p className="text-sm font-medium leading-none">Recommendation history</p>
                      </div>
                      <div className="flex items-center gap-x-2">
                        <span className="flex h-2 w-2 translate-y-1 rounded-full bg-sky-500" />
                        <p className="text-sm font-medium leading-none">Email support</p>
                      </div>
                    </div>
                  </CardFooter>
                </Card>
              </motion.div>

              <motion.div variants={zoom} viewport={{ once: true }}>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-start justify-between">
                      <Label>Ultimate</Label>
                      <Badge variant="outline">Free during beta</Badge>
                    </CardTitle>
                    <CardDescription>10$ / month</CardDescription>
                  </CardHeader>
                  <CardContent className="grid">
                    <Button variant="outline">Get started</Button>
                  </CardContent>
                  <CardFooter>
                    <div className="flex flex-col gap-y-4">
                      <div className="flex items-center gap-x-2">
                        <span className="flex h-2 w-2 translate-y-1 rounded-full bg-sky-500" />
                        <p className="text-sm font-medium leading-none">50 recommendations / month</p>
                      </div>
                      <div className="flex items-center gap-x-2">
                        <span className="flex h-2 w-2 translate-y-1 rounded-full bg-sky-500" />
                        <p className="text-sm font-medium leading-none">No need for an API key</p>
                      </div>
                      <div className="flex items-center gap-x-2">
                        <span className="flex h-2 w-2 translate-y-1 rounded-full bg-sky-500" />
                        <span className="text-xs text-muted-foreground">Soon™</span>
                        <p className="text-sm font-medium leading-none">Recommendation history</p>
                      </div>
                      <div className="flex items-center gap-x-2">
                        <span className="flex h-2 w-2 translate-y-1 rounded-full bg-sky-500" />
                        <p className="text-sm font-medium leading-none">Email support</p>
                      </div>
                    </div>
                  </CardFooter>
                </Card>
              </motion.div> */}
              {/* <motion.div
              variants={zoom}
              viewport={{ once: true }}
              className="m-4 flex flex-col rounded-2xl bg-card/80 px-6 py-8 ring-muted transition-all duration-300 ease-in-out hover:shadow-lg sm:px-8 md:hover:shadow-xl lg:py-8"
            >
              <p className="mt-4 text-base text-muted-foreground">Power of AI at no cost</p>
              <p className="order-first text-3xl font-bold tracking-tight md:text-4xl xl:text-5xl">$0</p>
              <ul role="list" className="order-last mt-6 flex flex-col gap-y-3 text-sm">
                <li className="flex">
                  🔑<span className="ml-1">Use your own API Key</span>
                </li>
                <li className="flex">
                  ✅<span className="ml-1">Absolutely free</span>
                </li>
                <li className="flex">
                  ❤️<span className="ml-1">Privacy friendly</span>
                </li>
                <li className="flex">
                  🔐<span className="ml-1">Security</span>
                </li>
              </ul>
              <Button size="lg" variant="secondary" className="mt-4 justify-start">
                Get started
              </Button>
            </motion.div> */}

              {/* <motion.div
              variants={zoom}
              viewport={{ once: true }}
              className="order-first flex flex-col rounded-2xl border-accent bg-card/80 px-6 py-8 ring-2 transition-all duration-300 ease-in-out hover:shadow-lg sm:px-8 md:hover:shadow-xl lg:order-none"
            >
              <p className="mt-4 text-base text-card-foreground">Unlock premium features</p>
              <div className="order-first flex items-center justify-between">
                <p className="text-3xl font-bold tracking-tight  md:text-4xl xl:text-5xl">$2</p>

              </div>
              <ul role="list" className="order-last mt-6 flex flex-col gap-y-3 text-sm">
                <li className="flex">
                  🔑<span className="ml-1">No need for an API key</span>
                </li>
                <li className="flex">
                  ➕<span className="ml-1">10 free recommendations / month</span>
                </li>
                <li className="flex">
                  🕑<span className="ml-1">Recommendation history</span>
                </li>
                <li className="flex">
                  🛟<span className="ml-1">Product support</span>
                </li>
              </ul>
              <Button size="lg" className="mt-4 justify-start">
                Try for free
              </Button>
            </motion.div> */}
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
}

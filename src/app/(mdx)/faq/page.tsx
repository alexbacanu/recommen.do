import type { Metadata } from "next";

import Link from "next/link";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { appwriteUrl } from "@/lib/envClient";

export const metadata: Metadata = {
  title: "Frequently Asked Questions",
};

export default function FAQPage() {
  return (
    <section id="faq_page">
      <div className="mx-auto flex max-w-7xl flex-col gap-y-4 p-4">
        <h1 className="text-3xl font-semibold">Frequently Asked Questions</h1>

        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger className="text-left">How can I use recommen.do extension?</AccordionTrigger>
            <AccordionContent>
              To get started with recommen.do, please follow our installation and usage guide. You can find detailed
              instructions{" "}
              <Link href={`${appwriteUrl}/installation`} className="text-primary">
                here
              </Link>
              .
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-2">
            <AccordionTrigger className="text-left">Do you offer a free trial?</AccordionTrigger>
            <AccordionContent>
              Yes, we provide a free trial period for our service. Upon creating an account, you will receive 10
              complimentary recommendations to explore the features and functionality of our product. These
              recommendations can be used during the trial period, which is 30 days.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-3">
            <AccordionTrigger className="text-left">How are recommendations consumed?</AccordionTrigger>
            <AccordionContent>
              One recommendation is consumed every time you ask for a recommendation by clicking &quot;Send&quot; in the
              AI prompt card. At the end of every billing cycle your remaining recommendations expire and new
              recommendations are added according to your plan.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-4">
            <AccordionTrigger className="text-left">
              What should I do if I exhaust my recommendations before the end of the current billing cycle?
            </AccordionTrigger>
            <AccordionContent>
              If you run out of recommendations before the end of the current billing cycle, don&apos;t worry! You can
              easily add 50 more recommendations by accessing the &quot;Add 50 more recommendations&quot; option in the
              usage section of your profile. These additional recommendations will be valid until the end of your
              current billing cycle. Alternatively, you can consider upgrading your subscription for the upcoming
              billing cycle. Just head over to the &quot;Manage subscription&quot; option to modify your plan.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-5">
            <AccordionTrigger className="text-left">Can I cancel my subscription at any time?</AccordionTrigger>
            <AccordionContent>
              Yes, you can cancel your subscription at any time. There are no long-term contracts or commitments. Simply
              navigate to the &quot;Manage subscription&quot; section in your profile to cancel your subscription. If
              you decide to cancel your subscription, you will still have access to the remaining recommendations until
              the end of the billing cycle.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-6">
            <AccordionTrigger className="text-left">Can I use my own OpenAI API Key?</AccordionTrigger>
            <AccordionContent>
              If you have an OpenAI API key you can get recommendations without having an active subscription. While the
              API Key mode is active, the recommendations you consume are not subtracted from your available
              recommendations. Use the &quot;OpenAI API Key&quot; section from the extension to add or clear your key.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-7">
            <AccordionTrigger className="text-left">
              What happens if I have a subscription active but I switch to API Key mode?
            </AccordionTrigger>
            <AccordionContent>
              Using an OpenAI API Key doesn&apos;t deplete your recommendations and doesn&apos;t require a subscription.
              You can cancel your subscription anytime via &quot;Manage Subscription&quot; or clear your API Key to use
              remaining recommendations.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-8">
            <AccordionTrigger className="text-left">What happens if I delete my account?</AccordionTrigger>
            <AccordionContent>
              Deleting your account is a permanent action. Please note that by deleting your account, your active
              subscription will be canceled, and any remaining recommendations will be forfeited.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </section>
  );
}

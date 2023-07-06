import Link from "next/link";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { appwriteUrl } from "@/lib/envClient";

export default function FAQPage() {
  return (
    <section id="faq_page">
      <div className="mx-auto flex max-w-7xl flex-col gap-y-4 p-4">
        {/* <FAQ /> */}

        <h1 className="text-3xl font-semibold">Frequently Asked Questions</h1>

        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger>How can I use recommen.do extension?</AccordionTrigger>
            <AccordionContent>
              To get started with recommen.do, please follow our installation and usage guide. You can find detailed
              instructions{" "}
              <Link href={`${appwriteUrl}/installation`} className="text-primary">
                here
              </Link>
              . .
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-2">
            <AccordionTrigger>
              What should I do if I exhaust my credits before the end of the current billing cycle?
            </AccordionTrigger>
            <AccordionContent>
              If you run out of credits before the end of the current billing cycle, don&apos;t worry! You can easily
              add 50 more recommendations by accessing the &quot;Add 50 more recommendations&quot; option in the usage
              section of your profile. These additional credits will be valid until the end of your current billing
              cycle. Alternatively, you can consider upgrading your subscription for the upcoming billing cycle. Just
              head over to the &quot;Manage subscription&quot; option to modify your plan.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-3">
            <AccordionTrigger>What happens if I delete my account?</AccordionTrigger>
            <AccordionContent>
              Deleting your account is a permanent action. Please note that by deleting your account, your active
              subscription will be canceled, and any remaining recommendations will be forfeited.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-4">
            <AccordionTrigger>Do you offer a free trial?</AccordionTrigger>
            <AccordionContent>
              Yes, we provide a free trial period for our service. Upon creating an account, you will receive 10
              complimentary recommendations to explore the features and functionality of our product. These credits can
              be used during the trial period, which is 30 days.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-5">
            <AccordionTrigger>Can I cancel my subscription at any time?</AccordionTrigger>
            <AccordionContent>
              Yes, you have the freedom to cancel your subscription at any time. There are no long-term contracts or
              commitments. Simply navigate to the &quot;Manage subscription&quot; section in your profile to cancel your
              subscription. If you decide to cancel your subscription, you will still have access to the remaining
              credits until the end of the billing cycle. This allows you to fully utilize the benefits of the trial
              period without any interruptions.
            </AccordionContent>
          </AccordionItem>

          {/* <AccordionItem value="item-4">
            <AccordionTrigger>Can I use my own OpenAI API key?</AccordionTrigger>
            <AccordionContent>
              If you have an OpenAI API key you can get recommendations without an active subscription. Use the
              &quot;OpenAI Api Key&quot; section available when logged in the extension to Add or Clear your OpenAI
              API Key.
            </AccordionContent>
          </AccordionItem> */}

          {/* <AccordionItem value="item-5">
            <AccordionTrigger>How are recommendations consumed?</AccordionTrigger>
            <AccordionContent>
              One recommendations is consumed every time you ask for a recommendation. Responses that do not follow a
              specific format do not consume recommendations. At the end of every billing cycle current available
              recommendations are destroyd and new recommendations are added according to your plan.
            </AccordionContent>
          </AccordionItem> */}

          {/* <AccordionItem value="item-6">
            <AccordionTrigger>
              What happens if I switch from a subscription to using my own OpenAI API Key?
            </AccordionTrigger>
            <AccordionContent>
              If you Add your OpenAI API Key to recommen.do extension you will be asked if you would like to cancel your
              subscription. You can do this anytime from the Subscripon section of your profile. Recommendation used
              while using an OpenAI API Key are not deducted from your subscription credits.
            </AccordionContent>
          </AccordionItem> */}
        </Accordion>
      </div>
    </section>
  );
}

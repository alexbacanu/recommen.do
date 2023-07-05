import Link from "next/link";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { appwriteUrl } from "@/lib/envClient";

export default function FAQPage() {
  return (
    <section id="faq_page">
      <div className="mx-auto flex max-w-7xl flex-col gap-y-4 p-4">
        {/* <FAQ /> */}

        <h1 className="text-3xl font-semibold">FAQ</h1>

        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger>How do I use recommen.do?</AccordionTrigger>
            <AccordionContent>
              Follow our installation and usage guide{" "}
              <Link href={`${appwriteUrl}/installation`} className="text-primary">
                here
              </Link>
              .
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-2">
            <AccordionTrigger>
              What should I do if I run out of credits before the end of the current billing cycle?
            </AccordionTrigger>
            <AccordionContent>
              If you run out of credits before the end of the current billing cycle you can use the &quot;Add 50 more
              recommendations&quot; option located in the usage section of your profile (either thru the extension or
              website). This will enable you to purchase 50 credits valid until the end of your current billing cycle.
              You can also consider upgrading your subscription starting from the next billing cycle - use the
              &quot;Manage subscription&quot; option to modify your plan.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-3">
            <AccordionTrigger>What happens when I delete my account?</AccordionTrigger>
            <AccordionContent>
              Deleting your account is immediate and irreversible. If you have an active subscription it will be
              canceled. By canceling your account you agree to forfeit all remaining recommendations.
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

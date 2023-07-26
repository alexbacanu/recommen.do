import type { BrowserDetails } from "@/lib/types/types";

import { appwriteUrl } from "@/lib/envClient";

export const browserDetails: BrowserDetails[] = [
  {
    name: "Mozilla Firefox",
    short: "firefox",
    href: "https://addons.mozilla.org/en-US/firefox/addon/recommen-do/",
    ariaLabel: "Add extension to Firefox",
    description: "Add extension to Firefox",
  },
  {
    name: "Google Chrome",
    short: "chrome",
    href: "https://chrome.google.com/webstore/detail/ai-recommendations-for-sh/obfbgdconmhiolihlenkaopigkpeblne",
    ariaLabel: "Get extension for Chrome",
    description: "Get extension for Chrome",
  },
  {
    name: "Microsoft Edge",
    short: "edge",
    href: "https://microsoftedge.microsoft.com/addons/detail/recommendo/pdahoiahedcdggmdopbgefclpcpeiioc",
    ariaLabel: "Get extension for Edge",
    description: "Get extension for Edge",
  },
  {
    name: "Brave",
    short: "brave",
    href: "https://chrome.google.com/webstore/detail/ai-recommendations-for-sh/obfbgdconmhiolihlenkaopigkpeblne",
    ariaLabel: "Get extension for Brave",
    description: "Get extension for Brave",
  },
  {
    name: "Opera",
    short: "opera",
    href: "https://chrome.google.com/webstore/detail/ai-recommendations-for-sh/obfbgdconmhiolihlenkaopigkpeblne",
    ariaLabel: "Get extension for Opera",
    description: "Get extension for Opera",
  },
  {
    name: "Vivaldi",
    short: "vivaldi",
    href: "https://chrome.google.com/webstore/detail/ai-recommendations-for-sh/obfbgdconmhiolihlenkaopigkpeblne",
    ariaLabel: "Get extension for Vivaldi",
    description: "Get extension for Vivaldi",
  },
];

export const siteConfig = {
  name: "recommen.do: AI-Powered Shopping Assistant",
  url: appwriteUrl,
  ogImage: `${appwriteUrl}/cover.png`,
  description:
    "🛍️Get shopping recommendations on Amazon, Newegg or Ebay, powered by OpenAI🤖. Enhance your online shopping experience with our browser extension",
  links: {
    github: "https://github.com/alexbacanu/recommen.do",
  },
  keywords: [
    "OpenAI Product Recommendations",
    "AI-Powered Browser Extension",
    "Intelligent Shopping Enhancements for Chrome/Firefox/Edge",
    "AI-Enabled Shopping on Amazon/Newegg/eBay",
    "Smart Online Shopping Tool",
  ],
};

export type SiteConfig = typeof siteConfig;

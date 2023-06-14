"use client";

import Script from "next/script";

import { gtagId } from "~/lib/envClient";

export default function GoogleAnalytics() {
  return (
    <>
      <Script
        id="gtag-analytics"
        src={`https://www.googletagmanager.com/gtag/js?id=${gtagId}`}
        strategy="afterInteractive"
        data-category="analytics"
        type="text/plain"
      />
      <Script id="google-analytics" strategy="afterInteractive" data-category="analytics" type="text/plain">
        {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', '${gtagId}');
            gtag('consent', 'default', {
              'ad_storage': 'denied',
              'analytics_storage': 'denied'
            });
        `}
      </Script>
    </>
  );
}

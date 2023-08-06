import browser from "webextension-polyfill";

export {};

// eslint-disable-next-line @typescript-eslint/no-misused-promises
browser.runtime.onInstalled.addListener(async ({ reason }) => {
  // if (temporary) return; // skip during development
  switch (reason) {
    case "install":
      {
        const url = browser.runtime.getURL("tabs/onboarding.html");
        await browser.tabs.create({ url });
        // or: await browser.windows.create({ url, type: "popup", height: 600, width: 600 });
      }
      break;
    // see below
  }
});

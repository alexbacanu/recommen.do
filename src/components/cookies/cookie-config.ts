import type { CookieConsentConfig } from "vanilla-cookieconsent";

const pluginConfig: CookieConsentConfig = {
  guiOptions: {
    consentModal: {
      layout: "cloud",
      position: "bottom center",
      flipButtons: false,
    },
    preferencesModal: {
      layout: "box",
    },
  },

  cookie: {
    expiresAfterDays: 356,
  },

  categories: {
    necessary: {
      readOnly: true,
      enabled: true,
    },
    authentication: {
      readOnly: true,
      enabled: true,
      autoClear: {
        cookies: [
          {
            name: /^(a_session_)/,
          },
        ],
        reloadPage: false,
      },
    },
    analytics: {
      readOnly: false,
      enabled: true,
      autoClear: {
        cookies: [
          {
            name: /^(_ga)/,
          },
        ],
        reloadPage: false,
      },
    },
  },

  // disablePageInteraction: true,

  language: {
    default: "en",

    translations: {
      en: {
        consentModal: {
          title: "We care that your personal data remains confidential!",
          description:
            'We use cookies to personalise content and to analyse our traffic. We also share information about your use of the website with our analytics partners. You may read more about any purposes or vendors that we use by clicking <a href="#" data-cc="show-preferencesModal">Cookie preferences</a>. This preference center is accessible at any time through the <a href="#" data-cc="show-preferencesModal">Cookie settings</a> button located on every page.',
          acceptAllBtn: "Accept",
          // acceptNecessaryBtn: "Accept only necesary",
          showPreferencesBtn: "Cookie settings",
          footer: `<a href="/en/privacy">Privacy Policy</a>`,
        },
        preferencesModal: {
          title: "Cookie settings 🍪",
          acceptNecessaryBtn: "Accept only necessary",
          acceptAllBtn: "Accept all",
          savePreferencesBtn: "Accept selected",
          closeIconLabel: "Close",
          sections: [
            {
              title: "Cookie Usage",
              description:
                'We use cookies to personalise content and to analyse our traffic. We also share information about your use of the website with our analytics partners. You may read more about any purposes or vendors that we use by clicking <a href="#" data-cc="show-preferencesModal">Cookie preferences</a>. This preference center is accessible at any time through the <a href="#" data-cc="show-preferencesModal">Cookie settings</a> button located on every page.',
            },
            {
              title: "Strictly necessary cookies",
              description:
                "Necessary cookies are essential for the proper functioning of a website and cannot be deactivated. These cookies do not store any personally identifiable information and are used solely for technical purposes, such as maintaining session information and facilitating navigation.",
              linkedCategory: "necessary",
              cookieTable: {
                headers: {
                  name: "Name",
                  domain: "Local",
                  description: "Description",
                  expiration: "Expiration",
                },
                body: [
                  {
                    name: "cc_cookie",
                    domain: "Cookie Consent",
                    description: 'Cookie set by <a href="https://cookieconsent.orestbida.com/">Cookie Consent v3</a>.',
                    expiration: "Expires after 12 months",
                  },
                ],
              },
            },
            {
              title: "Authentication cookies",
              description:
                "We use Appwrite Cloud for user authentication. We use cookies to identify you when you visit our website and as you navigate our website, to help us determine if you are logged into our website and to keep your website session alive.",
              linkedCategory: "authentication",
              cookieTable: {
                headers: {
                  name: "Name",
                  domain: "Service",
                  description: "Description",
                  expiration: "Expiration",
                },
                body: [
                  {
                    name: "_a_session_*, _a_session_*_legacy",
                    domain: "appwrite.cloud.io",
                    description: 'Cookie set by <a href="https://appwrite.io/policy/privacy">Appwrite Cloud</a>.',
                    expiration: "Expires after 12 months",
                  },
                ],
              },
            },
            {
              title: "Performance and analytics cookies",
              description:
                "Performance and analytics cookies are used to track website visitors and their user behavior. This data is then used to improve the way the website works and in turn, used to improve user experience.",
              linkedCategory: "analytics",
              cookieTable: {
                headers: {
                  name: "Name",
                  domain: "Local",
                  description: "Description",
                  expiration: "Expiration",
                },
                body: [
                  {
                    name: "_ga, _ga_*",
                    domain: "Google Analytics",
                    description:
                      'Cookie set by <a href="https://www.google.com/intl/analytics/policies/privacy/">Google Analytics</a>.',
                    expiration: "Expires after 12 months",
                  },
                ],
              },
            },
          ],
        },
      },
    },
  },
};

export default pluginConfig;

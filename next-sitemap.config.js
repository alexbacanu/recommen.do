/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_APPWRITE_URL ?? "",

  changefreq: "weekly",
  generateRobotsTxt: true,
  generateIndexSitemap: false,

  transform: async (config, url) => {
    const ignoredPaths = ["/payment/error", "/payment/success", "/payment/cancel", "/email-changed", "/profile"];

    if (ignoredPaths.includes(url)) {
      return null;
    }

    return {
      loc: url,
      priority: config.priority,
      changefreq: config.changefreq,
      lastmod: config.autoLastmod,
      alternateRefs: config.alternateRefs,
    };
  },
};

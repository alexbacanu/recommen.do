// @ts-nocheck
/** @type {import("prettier").Options} */
const config = {
  arrowParens: "always",
  bracketSpacing: true,
  quoteProps: "as-needed",
  semi: true,
  singleQuote: false,
  tabWidth: 2,
  trailingComma: "all",

  endOfLine: "auto",
  printWidth: 120,

  plugins: [
    // require.resolve("prettier-plugin-tailwindcss"),
    require.resolve("@ianvs/prettier-plugin-sort-imports"),
  ],

  importOrder: [
    "<TYPES>",
    "",
    "<BUILT_IN_MODULES>",
    "<THIRD_PARTY_MODULES>",
    "",
    "^(@/lib|@/styles|@/components)(/.*)$",
    "",
    "^[.]",
  ],
  importOrderTypeScriptVersion: "5.1.6",
};

module.exports = config;

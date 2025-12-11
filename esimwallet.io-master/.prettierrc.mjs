// @ts-check

/** @type {import("prettier").Config} */
const config = {
  singleQuote: true,
  quoteProps: 'consistent',
  proseWrap: 'preserve',

  overrides: [
    {
      files: '*.css.ts',
      quoteProps: 'as-needed',
    },
  ],

  plugins: ['@ianvs/prettier-plugin-sort-imports', 'prettier-plugin-organize-attributes'],
  attributeGroups: ['^class', '^(id|name)$', '^data-', '$DEFAULT', '^aria-'],
  importOrder: [
    '',
    '<BUILTIN_MODULES>',
    '^react(.*)$',
    '^next(.*)$',
    '^@react(.*)$',
    '^@next(.*)$',
    '^(vitest|@playwright)(.*)$',
    '<THIRD_PARTY_MODULES>',
    '',
    '^@/(config|data|env-helpers|esim-core|i18n|lib|navigation|payload)(.*)$',
    '',
    '^@/(.*)$',
    '^[./]',
  ],
  importOrderTypeScriptVersion: '5.0.0',
};

export default config;

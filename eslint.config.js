import process from 'node:process'
import pluginJs from '@eslint/js'
import pluginVueI18n from '@intlify/eslint-plugin-vue-i18n'
import pluginVue from 'eslint-plugin-vue'
import globals from 'globals'
import tseslint from 'typescript-eslint'

const enableI18nRawTextWarnings = process.env.I18N_RAW_TEXT !== 'off'

export default [
  { ignores: ['dist/**', 'node_modules/**', 'dev-dist/**'] },
  { files: ['**/*.{js,mjs,cjs,ts,vue}'] },
  { languageOptions: { globals: globals.browser } },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  ...pluginVue.configs['flat/recommended'],
  {
    files: ['**/*.vue'],
    languageOptions: {
      parserOptions: { parser: tseslint.parser }
    }
  },
  {
    files: ['src/**/*.vue'],
    plugins: {
      '@intlify/vue-i18n': pluginVueI18n
    },
    rules: {
      '@intlify/vue-i18n/no-raw-text': enableI18nRawTextWarnings ? 'warn' : 'off'
    }
  }
]

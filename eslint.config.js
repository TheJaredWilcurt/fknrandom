import pluginJs from '@eslint/js';
import tjwBase from 'eslint-config-tjw-base';
import tjwVue from 'eslint-config-tjw-vue';
import pluginVue from 'eslint-plugin-vue';

const vue3Recommended = pluginVue.configs['flat/recommended'];

export default [
  pluginJs.configs.recommended,
  ...vue3Recommended,
  tjwBase.configs.recommended,
  tjwVue,
  {
    languageOptions: {
      ecmaVersion: 2026
    },
    // project specific rules/settings
    rules: {
    }
  }
];

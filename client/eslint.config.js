import js from '@eslint/js';
// import parser from '@typescript-eslint/parser';
// import plugin from '@typescript-eslint/eslint-plugin';

export default [
  js.configs.recommended,
  ...tseslint.configs.recommended, // enables TypeScript rules
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: './tsconfig.json',
      },
    },
    rules: {
      '@typescript-eslint/no-unused-vars': 'warn',
      '@typescript-eslint/explicit-function-return-type': 'off',
    },
  },
];

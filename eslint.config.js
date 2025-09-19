import tseslint from '@typescript-eslint/eslint-plugin'
import tsParser from '@typescript-eslint/parser'
import vue from 'eslint-plugin-vue'
import prettierPlugin from 'eslint-plugin-prettier/recommended'
import globals from 'globals'

const tsConfigs = tseslint.configs['flat/recommended'].map((config) => ({
  ...config,
  files: ['**/*.{ts,tsx}']
}))

export default [
  {
    name: 'app/ignores',
    ignores: ['dist', 'node_modules']
  },
  ...vue.configs['flat/essential'],
  ...tsConfigs,
  {
    files: ['**/*.{ts,tsx,vue,js,jsx}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node
      }
    }
  },
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parserOptions: {
        projectService: {
          allowDefaultProject: ['./tsconfig.json']
        }
      }
    }
  },
  {
    files: ['**/*.vue'],
    languageOptions: {
      parserOptions: {
        parser: tsParser,
        extraFileExtensions: ['.vue'],
        projectService: {
          allowDefaultProject: ['./tsconfig.json']
        }
      }
    },
    rules: {
      'vue/multi-word-component-names': 'off',
      'vue/require-toggle-inside-transition': 'off'
    }
  },
  prettierPlugin
]

import { defineConfig, configDefaults } from 'vitest/config'

const { GRIDSOME_TEST } = process.env

if (!GRIDSOME_TEST) {
  console.error('GRIDSOME_TEST must be defined')
  process.exit(1)
}

export default defineConfig({
  test: {
    globals: true,
    watch: false,
    include: [
      `**/__tests__/**/*.${GRIDSOME_TEST === 'e2e' ? 'e2e' : 'spec'}.js`
    ],
    exclude: [
      ...configDefaults.exclude,
      'packages/vue-remark/__tests__/index.spec.js' // needs work
    ]
  }
})

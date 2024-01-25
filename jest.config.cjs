const { GRIDSOME_TEST = 'unit' } = process.env

/** @type {import('jest').Config} */
const config = {
  // detectLeaks: true,
  workerIdleMemoryLimit: '512MB',
  maxWorkers: 1,
  logHeapUsage: true,
  transform: {},
  testEnvironment: 'node',
  testMatch: [
    `**/__tests__/**/*.${GRIDSOME_TEST === 'e2e' ? 'e2e' : 'spec'}.js`
  ],
  collectCoverageFrom: [
    'gridsome/lib/**/*.js'
  ],
  testPathIgnorePatterns: [
    '/__fixtures__/',
    '/projects/',
    '/scripts/'
  ],
  watchPathIgnorePatterns: [
    '/__fixtures__/',
    '/node_modules/',
    '/projects/',
    '/.git/'
  ]
}

module.exports = config

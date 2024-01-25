import path from 'path'
import { getDirname } from 'cross-dirname'
import { createPolyfillScript, inlineCriticalCSS } from '../lib/inline.js'

test('inline critical css', async () => {
  const filePath = path.join(getDirname(), '__fixtures__/index.html')
  const html = await inlineCriticalCSS(filePath, {
    css: 'a{color:red;}'
  })

  expect(html).toMatchSnapshot()
})

test('inline critical css with polyfill', async () => {
  const filePath = path.join(getDirname(), '__fixtures__/index.html')
  const html = await inlineCriticalCSS(filePath, {
    polyfill: createPolyfillScript(),
    css: 'a{color:red;}'
  })

  expect(html).toMatchSnapshot()
})

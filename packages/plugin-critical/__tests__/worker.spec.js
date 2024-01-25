import path from 'path'
import { getDirname } from 'cross-dirname'
import { processHtmlFile } from '../lib/worker.js'

test('inline critical css', async () => {
  const filePath = path.join(getDirname(), '__fixtures__/index-2.html')
  const html = await processHtmlFile(filePath, {
    baseDir: path.join(getDirname(), '__fixtures__')
  })

  expect(html).toMatchSnapshot()
})

test('inline critical with publicPath', async () => {
  const filePath = path.join(getDirname(), '__fixtures__/index-public-path.html')
  const html = await processHtmlFile(filePath, {
    baseDir: path.join(getDirname(), '__fixtures__'),
    publicPath: '/path/to/subdir/',
    polyfill: false
  })

  expect(html).toMatchSnapshot()
})

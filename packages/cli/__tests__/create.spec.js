import fs from 'fs-extra'
import { join } from 'path'
import runCLI from './utils/helpers.js'
const genPath = join(__dirname, 'my-project')

beforeEach(() => {
  fs.ensureDirSync(genPath)
  fs.writeFileSync(join(genPath, 'index.js'), '// Test')
})

afterEach(() => {
  fs.removeSync(genPath)
})

test('warns if a directory with the same name exists in path', async () => {
  const { stderr } = await runCLI(['create', 'my-project'], { cwd: __dirname, reject: false })

  expect(stderr).toMatch('because the directory is not empty')
})

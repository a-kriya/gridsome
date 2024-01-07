import chalk from 'chalk'
import createApp from './app/index.js'
import Server from './server/Server'
import resolvePort from './server/resolvePort.js'
import { BOOTSTRAP_PAGES } from './utils/constants.js'
import utils from './server/utils'
const { prepareUrls } = utils

export default async (context, args) => {
  process.env.NODE_ENV = 'development'
  process.env.GRIDSOME_MODE = 'serve'
  const app = await createApp(context, { args }, BOOTSTRAP_PAGES)
  const port = await resolvePort(app.config.port)
  const hostname = app.config.host
  const urls = prepareUrls(hostname, port)
  const server = new Server(app, urls)
  server.listen(port, hostname, err => {
    if (err)
      throw err
    console.log()
    console.log(`  Explore GraphQL data at: ${chalk.cyan(urls.explore.pretty)}`)
    console.log()
  })
}

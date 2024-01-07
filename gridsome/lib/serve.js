import fs from 'fs-extra'
import chalk from 'chalk'
import * as express from 'express'
import createApp from './app/index.js'
import lodash from 'lodash'
import Server from './server/Server'
import { pathToRegexp, compile } from 'path-to-regexp'
import utils from './server/utils'
import resolvePort from './server/resolvePort.js'
import compileAssets from './webpack/compileAssets'
import renderer from './server/middlewares/renderer.js'
const { uniqBy } = lodash
const { prepareUrls } = utils

function createRoutes(app) {
  const pages = uniqBy(app.pages.data(), page => page.route)
  return pages.map(page => {
    const keys = []
    const regex = pathToRegexp(page.route, keys)
    const toPath = compile(page.route, { encode: encodeURIComponent })
    return {
      regex,
      path: page.path,
      route: page.route,
      query: page.query,
      toParams(url) {
        const matches = regex.exec(url)
        const params = {}
        keys.forEach((key, index) => {
          if (typeof key === 'object') {
            params[key.name] = matches[index + 1]
          }
        })
        return params
      },
      toPath(params) {
        return toPath(params)
      }
    }
  })
}

export default async (context, args) => {
  process.env.NODE_ENV = 'production'
  process.env.GRIDSOME_MODE = 'serve'
  const app = await createApp(context, { args })
  const port = await resolvePort(app.config.port)
  const hostname = app.config.host
  const urls = prepareUrls(hostname, port)
  const server = new Server(app, urls)
  const { config } = app
  await app.plugins.run('beforeServe', { context, config })
  await fs.ensureDir(config.cacheDir)
  await fs.emptyDir(config.outputDir)
  const routes = createRoutes(app)
  await compileAssets(app, {
    'process.env.SOCKJS_ENDPOINT': JSON.stringify(urls.sockjs.url),
    'process.env.GRAPHQL_ENDPOINT': JSON.stringify(urls.graphql.url)
  })
  server.hooks.setup.tap('serve', server => {
    server.use(express.static(config.outputDir))
    server.get('*', renderer(app, routes))
  })
  await app.plugins.run('afterServe', { context, config, app })
  server.listen(port, hostname, err => {
    if (err)
      throw err
    console.log()
    console.log(`  Site running at: ${chalk.cyan(urls.local.pretty)}`)
    console.log()
  })
}

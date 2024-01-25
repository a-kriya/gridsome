import fs from 'fs-extra'
import robotsTxt from 'generate-robotstxt'
import path from 'path'

const defaultEnv = 'development'

const defaultOptions = {
  output: '/robots.txt'
}

function writeFile(file, data) {
  return new Promise((resolve, reject) => {
    fs.writeFile(file, data, err => {
      if (err) {
        reject(err)
      }
      else {
        resolve()
      }
    })
  })
}

function getOptions(pluginOptions) {
  const options = { ...defaultOptions, ...pluginOptions }

  delete options.plugins

  const { env = {}, resolveEnv = () => process.env.SITE_ENV || process.env.NODE_ENV } = options

  const envOptions = env[resolveEnv()] || env[defaultEnv] || {}

  delete options.env
  delete options.resolveEnv

  return { ...options, ...envOptions }
}

/**
 * Gridsome plugin
 * @param {*} api The gridsome server api
 * @param {*} options The plugin options without merging default options
 */
function RobotsPlugin(api, options) {
  /**
     * The after build hook with gridsome config and queue??
     * config.{pathPrefix,publicPath,staticDir,outputDir,assetsDir,imagesDir,filesDir,dataDir,appPath}
     */
  api.afterBuild(async ({ config }) => {
    const userOptions = getOptions(options)

    if (!Object.prototype.hasOwnProperty.call(userOptions, 'host') ||
            !Object.prototype.hasOwnProperty.call(userOptions, 'sitemap')) {
      userOptions.host = config.siteUrl || config.url
      userOptions.sitemap = new URL('sitemap.xml', config.siteUrl).href
    }

    const { policy, sitemap, host, output, configFile } = userOptions

    const content = await robotsTxt({
      policy,
      sitemap,
      host,
      configFile
    })
    const filename = path.join(config.outputDir, output)

    return writeFile(path.resolve(filename), content)
  })
}

RobotsPlugin.defaultOptions = defaultOptions
export default RobotsPlugin

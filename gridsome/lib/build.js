import path from 'path'
import fs from 'fs-extra'
import pMap from 'p-map'
import hirestime from 'hirestime'
import lodash from 'lodash'
import sysinfo from './utils/sysinfo.js'
import executeQueries from './app/build/executeQueries.js'
import createRenderQueue from './app/build/createRenderQueue.js'
import { logAllWarnings } from './utils/deprecate.js'
import { log, info, writeLine } from './utils/log.js'
import createApp from './app/index.js'
import { createWorker } from './workers/index.js'
const { chunk } = lodash

async function runWebpack(app) {
  const compileTime = hirestime()

  if (!process.stdout.isTTY) {
    log(`Compiling assets...`)
  }

  const stats = await app.compiler.run()
  log(`Compile assets - ${compileTime.s()}s`)
  return stats
}

async function renderHTML(renderQueue, app, hash) {
  const timer = hirestime()
  const worker = createWorker('html-writer')
  const { htmlTemplate, clientManifestPath, serverBundlePath, prefetch, preload } = app.config
  await Promise.all(chunk(renderQueue, 350).map(async (pages) => {
    try {
      await worker.render({
        hash,
        pages,
        htmlTemplate,
        clientManifestPath,
        serverBundlePath,
        prefetch,
        preload
      })
    }
    catch (err) {
      worker.end()
      throw err
    }
  }))
  worker.end()
  log(`Render HTML (${renderQueue.length} files) - ${timer.s()}s`)
}

async function processFiles(files) {
  const timer = hirestime()
  const totalFiles = files.queue.length

  for (const file of files.queue) {
    await fs.copy(file.filePath, file.destPath)
  }

  log(`Process files (${totalFiles} files) - ${timer.s()}s`)
}

async function processImages(images, config) {
  const timer = hirestime()
  const chunks = chunk(images.queue, 25)
  const worker = createWorker('image-processor')
  const totalAssets = images.queue.length
  const totalJobs = chunks.length
  const existingImages = !config.emptyOutputDir
    ? await fs.readdir(config.imagesDir)
    : []
  let progress = 0
  writeLine(`Processing images (${totalAssets} images) - 0%`)

  try {
    await pMap(chunks, async (queue) => {
      await worker.process({
        queue,
        context: config.context,
        imagesConfig: config.images
      })
      writeLine(`Processing images (${totalAssets} images) - ${Math.round((++progress) * 100 / totalJobs)}%`)
    }, {
      concurrency: sysinfo.cpus.logical
    })
  }
  catch (err) {
    worker.end()
    throw err
  }

  worker.end()
  writeLine(`Process images (${totalAssets} images) - ${timer.s()}s\n`)

  // Remove images that existed before this build started but isn't in use.
  if (config.images.purge && existingImages.length) {
    const newImages = images.queue.map((c) => path.basename(c.destPath))
    const extraImages = existingImages.filter((value) => !newImages.includes(value))

    if (extraImages.length) {
      for (const filename of extraImages) {
        await fs.remove(path.join(config.imagesDir, filename))
      }

      info(`- Deleted ${extraImages.length} images that where no longer in use`)
    }
  }
}

export default async (context, args) => {
  process.env.NODE_ENV = 'production'
  process.env.GRIDSOME_MODE = 'static'
  const buildTime = hirestime()
  const app = await createApp(context, { args })
  const { config } = app
  await app.plugins.run('beforeBuild', { context, config })

  if (config.emptyOutputDir) {
    await fs.emptyDir(config.outputDir)
  }

  const stats = await runWebpack(app)
  const hashString = config.cacheBusting ? stats.hash : 'gridsome'
  const queue = createRenderQueue(app)
  const redirects = app.hooks.redirects.call([], queue)
  await executeQueries(queue, app, hashString)
  await renderHTML(queue, app, hashString)
  await processFiles(app.assets.files)
  await processImages(app.assets.images, app.config)

  // copy static files
  if (fs.existsSync(config.staticDir)) {
    await fs.copy(config.staticDir, config.outputDir, {
      dereference: true
    })
  }

  await app.plugins.run('afterBuild', () => ({ context, config, queue, redirects }))
  // clean up
  await fs.remove(config.manifestsDir)
  log()
  logAllWarnings(app.context)
  log(`  Done in ${buildTime.s()}s`)
  log()
  return app
}

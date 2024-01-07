import path from 'path'
import isUrl from 'is-url'
import * as mime from 'mime-types'
import FileProcessQueue from './FileProcessQueue.js'
import ImageProcessQueue from './ImageProcessQueue.js'
const isDev = process.env.NODE_ENV === 'development'

class AssetsQueue {
  constructor(app) {
    this.app = app
    this.index = new Map()
    this.files = new FileProcessQueue(app)
    this.images = new ImageProcessQueue(app)
  }
  async add(filePath, options) {
    const { config, context } = this.app
    const { ext } = path.parse(filePath)
    const isImage = config.imageExtensions.includes(ext.toLowerCase())
    const data = {
      type: isImage ? 'image' : 'file',
      mimeType: mime.lookup(filePath),
      isUrl: false,
      filePath
    }

    // TODO: process external files and images
    if (isUrl(filePath) || !filePath.startsWith(context)) {
      data.isUrl = true
      data.src = filePath
      return data
    }

    const asset = isImage
      ? await this.images.add(filePath, options)
      : await this.files.add(filePath, options)
    const entry = { ...data, ...asset }

    if (isDev) {
      if (asset.cacheKey) {
        this.index.set(asset.cacheKey, entry)
      }
      else {
        this.index.set(asset.src, entry)
      }
    }

    return entry
  }
  get(key) {
    return this.index.get(key)
  }
}

export default AssetsQueue

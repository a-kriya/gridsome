import importSync from 'import-sync'
import path from 'path'
import slash from 'slash'
import crypto from 'crypto'
import slugify from '@sindresorhus/slugify'

export const requireEsModule = (filename) => {
  const module = importSync(filename)
  return module.__esModule ? module.default : module
}

export const hashString = function (string) {
  return crypto.createHash('md5')
    .update(string)
    .digest('hex')
}

export const pipe = function (funcs, res, ...args) {
  return funcs.reduce(async (res, fn) => {
    return fn(await res, ...args)
  }, Promise.resolve(res))
}

export const forwardSlash = function (input) {
  return slash(input)
}

const slugify$0 = function (value) {
  return slugify(String(value), { separator: '-' })
}

export const safeKey = function (value) {
  return String(value).replace(/\./g, '-')
}

export const createPath = function (value, page = 1, isIndex = true) {
  const _segments = value.split('/').filter(v => !!v)
  if (page > 1)
    _segments.push(page)
  return {
    toUrlPath() {
      return `/${_segments.join('/')}`
    },
    toFilePath(context, ext) {
      const segments = _segments.map(s => decodeURIComponent(s))
      const fileName = isIndex ? `index.${ext}` : `${segments.pop() || 'index'}.${ext}`
      return path.join(context, ...segments, fileName)
    }
  }
}

export const isResolvablePath = function (value) {
  return (typeof value === 'string' &&
        path.extname(value).length > 1 &&
        (value.startsWith('.') || path.isAbsolute(value)))
}

export const isMailtoLink = string => String(string).startsWith('mailto:')
export const isTelLink = string => String(string).startsWith('tel:')
export { slugify$0 as slugify }

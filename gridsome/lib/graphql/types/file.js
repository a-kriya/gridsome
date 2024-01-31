import url from 'url'
import path from 'path'
import mime from 'mime-types'
import { isResolvablePath } from '../../utils/index.js'
import { SUPPORTED_IMAGE_TYPES } from '../../utils/constants.js'

export const isFile = value => {
  if (typeof value === 'string') {
    const mimeType = mime.lookup(value)
    const ext = path.extname(value).toLowerCase()

    if (ext.length && mimeType && mimeType !== 'application/x-msdownload') {
      const { hostname, pathname } = url.parse(value)

      if (hostname && pathname === '/') {
        return false
      }

      return (!SUPPORTED_IMAGE_TYPES.includes(ext) &&
                isResolvablePath(value))
    }
  }

  return false
}

export const createFileScalar = schemaComposer => {
  return schemaComposer.createScalarTC({
    name: 'File',
    serialize: value => value
  })
}

export const fileType = {
  type: 'File',
  args: {},
  async resolve(obj, args, context, { fieldName }) {
    const value = obj[fieldName]
    if (!value)
      return null
    const result = await context.assets.add(value)

    if (result.isUrl) {
      return result.src
    }

    return {
      type: result.type,
      mimeType: result.mimeType,
      src: result.src
    }
  }
}

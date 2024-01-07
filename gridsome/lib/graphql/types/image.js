import url from 'url'
import path from 'path'
import { isResolvablePath } from '../../utils/index.js'
import { SUPPORTED_IMAGE_TYPES } from '../../utils/constants.js'

export const createImageScalar = schemaComposer => {
  return schemaComposer.createScalarTC({
    name: 'Image',
    serialize: value => value
  })
}

export const createImageFitEnum = schemaComposer => {
  return schemaComposer.createEnumTC({
    name: 'ImageFit',
    values: {
      cover: {
        value: 'cover',
        name: 'Cover',
        description: 'Crop to cover both provided dimensions.'
      },
      contain: {
        value: 'contain',
        name: 'Contain',
        description: 'Embed within both provided dimensions.'
      },
      fill: {
        value: 'fill',
        name: 'Fill',
        description: 'Ignore the aspect ratio of the input and stretch to both provided dimensions.'
      },
      inside: {
        value: 'inside',
        name: 'Inside',
        description: 'Preserving aspect ratio, resize the image to be as large as possible while ensuring its dimensions are less than or equal to both those specified.'
      },
      outside: {
        value: 'outside',
        name: 'Outside',
        description: 'Preserving aspect ratio, resize the image to be as small as possible while ensuring its dimensions are greater than or equal to both those specified. Some of these values are based on the object-fit CSS property.'
      }
    }
  })
}

export const createImagePositionEnum = schemaComposer => {
  return schemaComposer.createEnumTC({
    name: 'ImagePosition',
    values: {
      top: {
        value: 'top',
        name: 'Top',
        description: 'Display the part of the image from the top center'
      },
      rightTop: {
        value: 'right top',
        name: 'Right Top',
        description: 'Display the part of the image from the top right'
      },
      right: {
        value: 'right',
        name: 'Right',
        description: 'Display the part of the image from the right center'
      },
      rightBottom: {
        value: 'right bottom',
        name: 'Right Bottom',
        description: 'Display the part of the image from the bottom right'
      },
      bottom: {
        value: 'bottom',
        name: 'Bottom',
        description: 'Display the part of the image from the bottom center'
      },
      leftBottom: {
        value: 'left bottom',
        name: 'Left Bottom',
        description: 'Display the part of the image from the bottom left'
      },
      left: {
        value: 'left',
        name: 'Left',
        description: 'Display the part of the image from the left center'
      },
      leftTop: {
        value: 'left top',
        name: 'Left Top',
        description: 'Display the part of the image from the top left'
      },
      center: {
        value: 'center',
        name: 'Center',
        description: 'Display the part of the image from the center'
      }
    }
  })
}

export const isImage = value => {
  if (typeof value === 'string') {
    const ext = path.extname(value).toLowerCase()
    const { hostname, pathname } = url.parse(value)

    if (hostname && pathname === '/') {
      return false
    }

    return (SUPPORTED_IMAGE_TYPES.includes(ext) &&
            isResolvablePath(value))
  }

  return false
}

export const imageType = {
  type: 'Image',
  args: {
    width: { type: 'Int', description: 'Width' },
    height: { type: 'Int', description: 'Height' },
    fit: { type: 'ImageFit', description: 'Fit', defaultValue: 'cover' },
    position: { type: 'ImagePosition', description: 'Position of the visible part for \'cover\' or \'contain\'', defaultValue: 'center' },
    quality: { type: 'Int', description: 'Quality (default: 75)' },
    blur: { type: 'Int', description: 'Blur level for base64 string' },
    background: { type: 'String', description: 'Background color for \'contain\'' }
  },
  async resolve(obj, args, context, { fieldName }) {
    const value = obj[fieldName]
    let result
    if (!value)
      return null

    if (args.position === 'center') {
      delete args.position
    }

    try {
      result = await context.assets.add(value, args)
    }
    catch (err) {
      return null
    }

    if (result.isUrl) {
      return result.src
    }

    return {
      type: result.type,
      mimeType: result.mimeType,
      src: result.src,
      size: result.size,
      sizes: result.sizes,
      srcset: result.srcset,
      dataUri: result.dataUri
    }
  }
}

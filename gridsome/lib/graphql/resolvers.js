import { dateType } from './types/date.js'
import { fileType } from './types/file.js'
import { imageType } from './types/image.js'
const scalarTypeResolvers = {
  Date: dateType,
  File: fileType,
  Image: imageType
}
export { scalarTypeResolvers }
export default {
  scalarTypeResolvers
}

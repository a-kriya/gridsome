import { BOOTSTRAP_FULL } from '../utils/constants.js'
import App from './App.js'

export default async (context, options = {}, phase = BOOTSTRAP_FULL) => {
  const instance = new App(context, options)
  await instance.bootstrap(phase)
  return instance
}

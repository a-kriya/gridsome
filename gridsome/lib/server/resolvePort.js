import portfinder from 'portfinder'

export default (port) => {
  if (port) return Promise.resolve(port)
  return portfinder.getPortPromise({ basePort: 8080 })
}

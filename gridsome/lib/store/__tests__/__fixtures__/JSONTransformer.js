class JSONTransformer {
  static mimeTypes() {
    return ['application/json']
  }

  parse(content) {
    return JSON.parse(content)
  }
}

export default JSONTransformer

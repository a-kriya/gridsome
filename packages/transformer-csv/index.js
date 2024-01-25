import csvParse from 'csv-parse/lib/sync'

class CSVTransformer {
  static mimeTypes() {
    return ['text/csv']
  }
  parse(source) {
    const records = csvParse(source, {
      columns: true,
      skip_empty_lines: true
    })
    return { records }
  }
}

export default CSVTransformer

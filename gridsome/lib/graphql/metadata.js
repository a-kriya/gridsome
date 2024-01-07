import lodash from 'lodash'
import { createFieldTypes } from './createFieldTypes.js'
import createFieldDefinitions from './createFieldDefinitions.js'
const { isEmpty } = lodash

function inferMetadata(schemaComposer, typeCompoer, metadata) {
  const fieldDefs = createFieldDefinitions([metadata])
  const fieldTypes = createFieldTypes(schemaComposer, fieldDefs, 'Metadata')

  for (const fieldName in fieldTypes) {
    if (!typeCompoer.hasField(fieldName)) {
      typeCompoer.setField(fieldName, fieldTypes[fieldName])
    }
  }
}

function addQueryField(schemaComposer, typeCompoer, metadata) {
  if (isEmpty(typeCompoer.getFields())) {
    return
  }

  schemaComposer.Query.setField('metadata', {
    type: 'Metadata',
    resolve: () => metadata
  })
}

export default (schemaComposer, store) => {
  const metadata = store.metadata.find().reduce((fields, obj) => {
    fields[obj.key] = obj.data
    return fields
  }, {})

  if (!schemaComposer.has('Metadata')) {
    schemaComposer.createObjectTC('Metadata')
  }

  const typeCompoer = schemaComposer.get('Metadata')
  const extensions = typeCompoer.getExtensions()

  if (extensions.isCustomType && !extensions.infer) {
    return addQueryField(schemaComposer, typeCompoer, metadata)
  }

  inferMetadata(schemaComposer, typeCompoer, metadata)
  addQueryField(schemaComposer, typeCompoer, metadata)
}

const db = require('./db.json')
import fs from 'fs'
import { debounce } from 'lodash'

const flush = debounce(
  () => {
    fs.writeFile('./db.json', JSON.stringify(db), () => {})
  },
  500,
  { leading: false, trailing: true }
)

function persist(collection: string, id: string, document: any) {
  db[collection] = db[collection] ?? {}
  db[collection][id] = document
  flush()
}

function get(collection: string, id: string) {
  return db[collection]?.[id]
}
export const state = {
  persist,
  get
}

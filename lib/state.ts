const db = require('./db.json')
import fs from 'fs'

function persist(collection: string, id: string, document: any) {
  db[collection] = db[collection] ?? {}
  db[collection][id] = document
  fs.writeFile('./db.json', JSON.stringify(db), () => {})
}

function get(collection: string, id: string) {
  return db[collection]?.[id]
}
export const state = {
  persist,
  get
}

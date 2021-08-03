const db = require('../db.json')
import fs from 'fs'
import { throttle } from 'lodash'

const flush = throttle(() => {
  console.log('persist')
  fs.writeFile('./db.json', JSON.stringify(db), () => {})
}, 5000)

function persist(collection: string, id: string, document: any) {
  db[collection] = db[collection] ?? {}
  db[collection][id] = document
  flush()
}

function getCollection(collection: string) {
  return db[collection]
}

function getById(collection: string, id: string) {
  return db[collection]?.[id]
}

export const state = {
  persist,
  getById,
  getCollection
}

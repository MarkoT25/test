const db = require('../db')

async function getById(id) {
  return db('movies').where({ id }).first()
}

async function create({ title }) {
  const [id] = await db('movies').insert({ title })
  return getById(id)
}

module.exports = { getById, create }

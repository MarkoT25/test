const db = require('../db')

async function create({ message, rating, user_id, movie_id }) {
  const [id] = await db('reviews').insert({ message, rating, user_id, movie_id })
  return getById(id)
}

async function getByMovie(movie_id, sort_rating = 'ASC') {
  return db('reviews').where({ movie_id }).orderBy('rating', sort_rating)
}

async function getByUser(user_id) {
  return db('reviews').where({ user_id })
}

async function getById(id) {
  return db('reviews').where({ id }).first()
}

async function getAvgRating(movie_id) {
  const result = await db('reviews').where({ movie_id }).avg('rating as avg')
  return result[0].avg
}

module.exports = { create, getByMovie, getByUser, getById, getAvgRating }

# API za ocjenjivanje filmova – Drugi kolokvij Grupa C

## Sadržaj

Ovaj projekt implementira REST API za ocjenjivanje filmova. Svaka kritika ima poruku, ocjenu (1-5), korisnika i vezu na film. API omogućuje dodavanje, dohvat i prosjek kritika, uz autentikaciju korisnika.

---

## 1. Migracije

### a) Tablica za filmove (`db/migrations/xxxx_create-movie-table.js`)
```js
exports.up = function(knex) {
  return knex.schema.createTable('movies', table => {
    table.increments('id')
    table.string('title', 255).notNullable()
    table.timestamp('created_at').defaultTo(knex.fn.now())
  })
}

exports.down = function(knex) {
  return knex.schema.dropTable('movies')
}
```

### b) Tablica za kritike (`db/migrations/xxxx_create-review-table.js`)
```js
exports.up = function(knex) {
  return knex.schema.createTable('reviews', table => {
    table.increments('id')
    table.text('message').notNullable()
    table.integer('rating').notNullable()
    table.integer('user_id').unsigned().notNullable().references('id').inTable('users').onDelete('CASCADE')
    table.integer('movie_id').unsigned().notNullable().references('id').inTable('movies').onDelete('CASCADE')
    table.timestamp('created_at').defaultTo(knex.fn.now())
  })
}

exports.down = function(knex) {
  return knex.schema.dropTable('reviews')
}
```

---

## 2. Repozitoriji

### a) `repo/movie.js`
```js
const db = require('../db')

async function getById(id) {
  return db('movies').where({ id }).first()
}

async function create({ title }) {
  const [id] = await db('movies').insert({ title })
  return getById(id)
}

module.exports = { getById, create }
```

### b) `repo/review.js`
```js
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
```

---

## 3. Middleware

### a) Autorizacija (`middleware/auth.js`)
```js
const jwt = require('jsonwebtoken')
const userRepo = require('../repo/user')

module.exports = async (ctx, next) => {
  const auth = ctx.headers.authorization
  if (!auth) ctx.throw(401, 'No token')
  const token = auth.replace('Bearer ', '')
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET)
    ctx.state.user = await userRepo.getById(payload.id)
    if (!ctx.state.user) ctx.throw(401, 'User not found')
    await next()
  } catch (e) {
    ctx.throw(401, 'Invalid token')
  }
}
```

---

## 4. Rute

### a) `route/review.js`
```js
const Router = require('@koa/router')
const Joi = require('joi')
const reviewRepo = require('../repo/review')
const auth = require('../middleware/auth')
const validation = require('../middleware/validate')

const router = new Router()

router.post(
  '/reviews',
  auth,
  validation.body({
    message: Joi.string().required(),
    rating: Joi.number().integer().min(1).max(5).required(),
    movie_id: Joi.number().integer().required()
  }),
  async ctx => {
    const { message, rating, movie_id } = ctx.request.body
    const user_id = ctx.state.user.id
    ctx.body = await reviewRepo.create({ message, rating, user_id, movie_id })
  }
)

router.get('/movies/:movieId/reviews', async ctx => {
  const sort = ctx.query.sort_rating === 'DESC' ? 'DESC' : 'ASC'
  ctx.body = await reviewRepo.getByMovie(ctx.params.movieId, sort)
})

router.get('/user-reviews', auth, async ctx => {
  ctx.body = await reviewRepo.getByUser(ctx.state.user.id)
})

router.get('/movies/:movieId/avg-rating', async ctx => {
  ctx.body = { avg: await reviewRepo.getAvgRating(ctx.params.movieId) }
})

module.exports = router
```

---

## 5. Uključi rute u aplikaciju

U `app.js` dodaj liniju:
```js
// ...existing code...
app.use(require('./route/review').routes())
// ...existing code...
```

---

## 6. Testovi

### a) `route/review.spec.js`
```js
const { expect } = require('chai')
const userRepo = require('../repo/user')
const movieRepo = require('../repo/movie')
const reviewRepo = require('../repo/review')
const { getAuthHeadersForUserId } = require('../apiTest')

describe('Review routes', function () {
  let user, movie

  before(async function () {
    user = await userRepo.getByEmail('user01@mail.com')
    movie = await movieRepo.create({ title: 'Test Movie' })
  })

  it('should create a new review', async function () {
    const resp = await global.api.post('/reviews')
      .set('Authorization', getAuthHeadersForUserId(user.id))
      .send({
        message: 'Odličan film!',
        rating: 5,
        movie_id: movie.id
      })
      .expect(200)
    expect(resp.body.message).to.equal('Odličan film!')
    expect(resp.body.rating).to.equal(5)
    expect(resp.body.user_id).to.equal(user.id)
    expect(resp.body.movie_id).to.equal(movie.id)
  })

  it('should return average rating for a movie', async function () {
    await reviewRepo.create({ message: 'ok', rating: 3, user_id: user.id, movie_id: movie.id })
    const resp = await global.api.get(`/movies/${movie.id}/avg-rating`).expect(200)
    expect(resp.body.avg).to.be.a('number')
  })
})
```

---

## Pokretanje

1. Pokreni migracije i seedove:
   ```sh
   npm run db:reset
   ```
2. Pokreni testove:
   ```sh
   npm test
   ```

Ako trebaš još detalja za neki dio, pogledaj kod iznad ili pitaj!

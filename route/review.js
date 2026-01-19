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

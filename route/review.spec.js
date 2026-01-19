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

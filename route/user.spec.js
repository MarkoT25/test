const { expect } = require('chai')
const userRepo = require('../repo/user')

describe('User routes', function () {
	describe('GET /users', function () {
		it('should fetch users', async function () {
			const resp = await global.api.get('/users')
			.expect(200)

			expect(resp.body.length > 0).to.be.true
			expect(Object.keys(resp.body[0])).to.deep.equal([
				'id',
				'email',
				'password',
				'created_at'
			])
		})
	})

	describe('GET /users/:userId', async function () {
		let createdUser
		const userEmail = 'automation.test@mail.com'

		before(async function () {
			createdUser = await userRepo.create({
				email: userEmail,
				password: 'sifra123'
			})
		})

		it('should fetch the user by id', async function () {
			const resp = await global.api.get(`/users/${createdUser.id}`)
			.expect(200)

			expect(resp.body.email).to.be.equal(userEmail)
		})
	})

	describe('POST /users', async function () {
		it('should create a new user', async function () {
			const newEmail = 'new.email@mail.com'
			const resp = await global.api.post('/users')
			.send({
				email: newEmail,
				password: 'sifra123'
			})
			.expect(200)

			expect(resp.body.email).to.be.equal(newEmail)
		})
	})

	describe('POST /login', function () {
		it('should log in the user', async function () {
			const resp = await global.api.post('/login')
			.send({
				email: 'user01@mail.com',
				password: 'sifra123'
			})

			expect(!!resp.body.token).to.be.true
		})
	})
})
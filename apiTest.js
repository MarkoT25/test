const supertest = require('supertest')

const db = require('./db')
const app = require('./app')
const { jwtUserId } = require('./repo/user')

global.api = supertest(app.callback())

const getAuthHeadersForUserId = (userId) => `Bearer ${jwtUserId(userId)}`

module.exports = {
	getAuthHeadersForUserId,
	mochaHooks: {		
		afterAll: async function () {
			await db.destroy()
		}
	}
}
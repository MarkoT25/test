const Router = require('@koa/router')
const Joi = require('joi')

const userRepo = require('../repo/user')
const validationMiddleware = require('../middleware/validate')

const router = new Router()

router.get('/users', async ctx => {
  ctx.body = await userRepo.get()
})

router.get(
	'/users/:userId', 
	validationMiddleware.params({
		userId: Joi.number().integer().required(),
		}),
	async ctx => {
  	ctx.body = await userRepo.getById(ctx.request.params.userId)
	}
)

router.post(
	'/users', 
	validationMiddleware.body({
		email: Joi.string().trim().required(),
		password: Joi.string().trim().required(),
	}), 
	async ctx => {
  	ctx.body = await userRepo.create(ctx.request.body)
	}
)

// login usera
router.post('/login', validationMiddleware.body({
	email: Joi.string().trim().required(),
	password: Joi.string().trim().required(),
}), 
async ctx => {
	const user = await userRepo.getByEmail(ctx.request.body.email)
	
	if (!user) {
		throw new Error('Invalid credentials!')
	}

	const isPassNotGood = await userRepo.checkPassword(
		user.password, 
		ctx.request.body.password
	)
	if (!isPassNotGood) {
		throw new Error('Invalid credentials!')
	}
	
	ctx.body = { token: userRepo.jwtUserId(user.id) }
})

module.exports = router
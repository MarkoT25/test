const Joi = require('joi')

const validate = section => objSchema => {
	const validationSchema = Joi.object(objSchema)

	return async (ctx, next) => {
		try {
			await validationSchema.validateAsync(ctx.request[section])
			return next()
		} catch (err) {
			throw err
		}
	}
}

module.exports = {
	body: validate('body'),
	params: validate('params'),
}
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

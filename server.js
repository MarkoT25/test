// ovdje samo pokrecemo server
const app = require('./app')

const PORT = process.env.PORT

app.listen(PORT, err => {
  if (err) {
    console.error(err)
    return
  }
  console.log('Working on', PORT)
})
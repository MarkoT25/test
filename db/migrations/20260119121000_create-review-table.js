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

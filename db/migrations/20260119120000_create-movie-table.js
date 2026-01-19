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

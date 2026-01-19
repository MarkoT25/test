const path = require('path')

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
module.exports = {
  client: 'sqlite3',
  connection: {
    filename: path.join(__dirname, 'db', 'sqlite3')
  },
  migrations: {
    tableName: 'knex_migrations',
    directory: path.join(__dirname, 'db', 'migrations')
  },
  seeds: {
    directory: path.join(__dirname, 'db', 'seeds'),
  }
};

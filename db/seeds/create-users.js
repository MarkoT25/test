const { hashPassword } = require("../../repo/user");

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  await knex('users').del()
  const users = [
    { email: 'user01@mail.com'},
    { email: 'user02@mail.com'},
    { email: 'user03@mail.com'}
  ]

  for (const user of users) {
    user.password = await hashPassword('sifra123')
  }
  await knex('users').insert(users);
};

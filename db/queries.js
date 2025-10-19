const pool = require("./pool");

async function insertNewUser(...userInfo) {
  await pool.query(
    `INSERT INTO users (first_name, last_name, email, password, is_admin) 
        VALUES (($1), ($2), ($3), ($4), ($5))`,
    userInfo,
  );
}

async function getUserByEmail(email) {
  const { rows } = await pool.query(`SELECT * FROM users WHERE email = ($1)`, [
    email,
  ]);

  return rows[0];
}

async function getUserById(id) {
  const { rows } = await pool.query(`SELECT * FROM users WHERE id = ($1)`, [
    id,
  ]);

  return rows[0];
}

async function updateMembership(id) {
  await pool.query(
    `UPDATE users
    SET is_member = TRUE
    WHERE id = ($1)`,
    [id],
  );
}

module.exports = {
  insertNewUser,
  getUserByEmail,
  getUserById,
  updateMembership,
};

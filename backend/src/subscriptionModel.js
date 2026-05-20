const pool = require('./database');

const findAll = async (userId) => {
  const result = await pool.query(
    `SELECT s.*, pc.name AS card_name
     FROM subscriptions s
     LEFT JOIN payment_cards pc ON s.card_id = pc.id
     WHERE s.user_id = $1
     ORDER BY s.created_at DESC`,
    [userId]
  );
  return result.rows;
};

const findById = async (id, userId) => {
  const result = await pool.query(
    'SELECT * FROM subscriptions WHERE id = $1 AND user_id = $2',
    [id, userId]
  );
  return result.rows[0];
};

const create = async ({ name, price, cycle, start_date, status, notes, card_id, user_id }) => {
  const result = await pool.query(
    `INSERT INTO subscriptions (name, price, cycle, start_date, status, notes, card_id, user_id)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
     RETURNING *`,
    [name, price, cycle, start_date, status || 'active', notes || null, card_id || null, user_id]
  );
  return result.rows[0];
};

const update = async (id, userId, fields) => {
  const keys = Object.keys(fields).filter((k) => fields[k] !== undefined);
  if (keys.length === 0) return findById(id, userId);

  const setClauses = keys.map((key, i) => `${key} = $${i + 1}`);
  const values = keys.map((key) => fields[key]);
  values.push(id, userId);

  const result = await pool.query(
    `UPDATE subscriptions SET ${setClauses.join(', ')} WHERE id = $${values.length - 1} AND user_id = $${values.length} RETURNING *`,
    values
  );
  return result.rows[0];
};

const remove = async (id, userId) => {
  const result = await pool.query(
    'DELETE FROM subscriptions WHERE id = $1 AND user_id = $2',
    [id, userId]
  );
  return result.rowCount;
};

module.exports = { findAll, findById, create, update, remove };

const pool = require('./database');

const findAll = async () => {
  const result = await pool.query(
    'SELECT * FROM subscriptions ORDER BY created_at DESC'
  );
  return result.rows;
};

const findById = async (id) => {
  const result = await pool.query(
    'SELECT * FROM subscriptions WHERE id = $1',
    [id]
  );
  return result.rows[0];
};

const create = async ({ name, price, cycle, start_date, status, notes }) => {
  const result = await pool.query(
    `INSERT INTO subscriptions (name, price, cycle, start_date, status, notes)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING *`,
    [name, price, cycle, start_date, status || 'active', notes || null]
  );
  return result.rows[0];
};

const update = async (id, fields) => {
  const keys = Object.keys(fields).filter((k) => fields[k] !== undefined);
  if (keys.length === 0) return findById(id);

  const setClauses = keys.map((key, i) => `${key} = $${i + 1}`);
  const values = keys.map((key) => fields[key]);
  values.push(id);

  const result = await pool.query(
    `UPDATE subscriptions SET ${setClauses.join(', ')} WHERE id = $${values.length} RETURNING *`,
    values
  );
  return result.rows[0];
};

const remove = async (id) => {
  const result = await pool.query(
    'DELETE FROM subscriptions WHERE id = $1',
    [id]
  );
  return result.rowCount;
};

module.exports = { findAll, findById, create, update, remove };

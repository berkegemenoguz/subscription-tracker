const pool = require('./database');

const findAll = async () => {
  const result = await pool.query('SELECT * FROM payment_cards ORDER BY name');
  return result.rows;
};

const create = async (data) => {
  const result = await pool.query(
    'INSERT INTO payment_cards (name) VALUES ($1) RETURNING *',
    [data.name]
  );
  return result.rows[0];
};

const remove = async (id) => {
  const result = await pool.query('DELETE FROM payment_cards WHERE id = $1', [id]);
  return result.rowCount;
};

const countSubscriptionsByCardId = async (cardId) => {
  const result = await pool.query(
    'SELECT COUNT(*) FROM subscriptions WHERE card_id = $1',
    [cardId]
  );
  return parseInt(result.rows[0].count, 10);
};

module.exports = { findAll, create, remove, countSubscriptionsByCardId };

const pool = require('./database');

const findAll = async (userId) => {
  const result = await pool.query(
    'SELECT * FROM payment_cards WHERE user_id = $1 ORDER BY name',
    [userId]
  );
  return result.rows;
};

const create = async (data) => {
  const result = await pool.query(
    'INSERT INTO payment_cards (name, user_id) VALUES ($1, $2) RETURNING *',
    [data.name, data.user_id]
  );
  return result.rows[0];
};

const remove = async (id, userId) => {
  const result = await pool.query(
    'DELETE FROM payment_cards WHERE id = $1 AND user_id = $2',
    [id, userId]
  );
  return result.rowCount;
};

const countSubscriptionsByCardId = async (cardId, userId) => {
  const result = await pool.query(
    'SELECT COUNT(*) FROM subscriptions WHERE card_id = $1 AND user_id = $2',
    [cardId, userId]
  );
  return parseInt(result.rows[0].count, 10);
};

module.exports = { findAll, create, remove, countSubscriptionsByCardId };

CREATE TABLE IF NOT EXISTS users (
  id         SERIAL PRIMARY KEY,
  email      VARCHAR(255) UNIQUE NOT NULL,
  password   VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS payment_cards (
  id         SERIAL PRIMARY KEY,
  name       VARCHAR(100) NOT NULL,
  user_id    INTEGER      NOT NULL REFERENCES users(id),
  created_at TIMESTAMP    DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS subscriptions (
  id         SERIAL PRIMARY KEY,
  name       VARCHAR(100)  NOT NULL,
  price      DECIMAL(10,2) NOT NULL,
  cycle      VARCHAR(10)   NOT NULL CHECK (cycle IN ('monthly', 'yearly')),
  start_date DATE          NOT NULL,
  status     VARCHAR(10)   DEFAULT 'active' CHECK (status IN ('active', 'cancelled')),
  notes      TEXT,
  card_id    INTEGER       REFERENCES payment_cards(id),
  user_id    INTEGER       NOT NULL REFERENCES users(id),
  created_at TIMESTAMP     DEFAULT NOW()
);

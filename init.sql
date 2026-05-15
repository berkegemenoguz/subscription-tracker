CREATE TABLE IF NOT EXISTS payment_cards (
  id         SERIAL PRIMARY KEY,
  name       VARCHAR(100) NOT NULL,
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
  created_at TIMESTAMP     DEFAULT NOW()
);

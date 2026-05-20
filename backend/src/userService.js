const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userModel = require('./userModel');
const { AppError } = require('./subscriptionService');

const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

const register = async ({ email, password }) => {
  const existing = await userModel.findByEmail(email);
  if (existing) {
    throw new AppError('Email already registered', 409);
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await userModel.create({ email, password: hashedPassword });
  const token = generateToken(user.id);

  return { user, token };
};

const login = async ({ email, password }) => {
  const user = await userModel.findByEmail(email);
  if (!user) {
    throw new AppError('Invalid credentials', 401);
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new AppError('Invalid credentials', 401);
  }

  const token = generateToken(user.id);

  return {
    user: { id: user.id, email: user.email, created_at: user.created_at },
    token,
  };
};

module.exports = { register, login };

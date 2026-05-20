const express = require('express');
const router = express.Router();
const userService = require('./userService');

router.post('/register', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const errors = [];

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.push('Valid email is required');
    }
    if (!password || password.length < 6) {
      errors.push('Password must be at least 6 characters');
    }
    if (errors.length > 0) return res.status(400).json({ errors });

    const result = await userService.register({ email, password });
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
});

router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const errors = [];

    if (!email) errors.push('Email is required');
    if (!password) errors.push('Password is required');
    if (errors.length > 0) return res.status(400).json({ errors });

    const result = await userService.login({ email, password });
    res.json(result);
  } catch (err) {
    next(err);
  }
});

module.exports = router;

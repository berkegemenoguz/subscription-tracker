const express = require('express');
const router = express.Router();
const paymentCardService = require('./paymentCardService');
const { validateCreateCard } = require('./validation');

/**
 * @swagger
 * components:
 *   schemas:
 *     PaymentCard:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         name:
 *           type: string
 *           example: Ziraat Bankası
 *         created_at:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /api/payment-cards:
 *   get:
 *     summary: Get all payment cards
 *     tags: [Payment Cards]
 *     responses:
 *       200:
 *         description: List of payment cards
 */
router.get('/', async (req, res) => {
  try {
    const cards = await paymentCardService.getAllCards();
    res.json(cards);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

/**
 * @swagger
 * /api/payment-cards:
 *   post:
 *     summary: Create a new payment card
 *     tags: [Payment Cards]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name]
 *             properties:
 *               name:
 *                 type: string
 *                 example: Garanti BBVA
 *     responses:
 *       201:
 *         description: Card created
 *       400:
 *         description: Validation error
 */
router.post('/', (req, res, next) => {
  const errors = validateCreateCard(req.body);
  if (errors.length > 0) return res.status(400).json({ errors });
  next();
}, async (req, res) => {
  try {
    const card = await paymentCardService.createCard(req.body);
    res.status(201).json(card);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

/**
 * @swagger
 * /api/payment-cards/{id}:
 *   delete:
 *     summary: Delete a payment card
 *     tags: [Payment Cards]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Card deleted
 *       400:
 *         description: Card has linked subscriptions
 *       404:
 *         description: Card not found
 */
router.delete('/:id', async (req, res) => {
  try {
    await paymentCardService.deleteCard(parseInt(req.params.id, 10));
    res.status(204).end();
  } catch (err) {
    if (err.statusCode) {
      return res.status(err.statusCode).json({ error: err.message });
    }
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;

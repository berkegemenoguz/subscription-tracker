const express = require('express');
const router = express.Router();
const subscriptionService = require('./subscriptionService');
const {
  validateCreateSubscription,
  validateUpdateSubscription,
  validateId,
} = require('./validation');

/**
 * @swagger
 * components:
 *   schemas:
 *     Subscription:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         name:
 *           type: string
 *           example: Netflix
 *         price:
 *           type: number
 *           format: float
 *           example: 15.99
 *         cycle:
 *           type: string
 *           enum: [monthly, yearly]
 *           example: monthly
 *         start_date:
 *           type: string
 *           format: date
 *           example: "2024-01-15"
 *         status:
 *           type: string
 *           enum: [active, cancelled]
 *           example: active
 *         notes:
 *           type: string
 *           example: Premium plan
 *         created_at:
 *           type: string
 *           format: date-time
 *     SubscriptionInput:
 *       type: object
 *       required:
 *         - name
 *         - price
 *         - cycle
 *         - start_date
 *       properties:
 *         name:
 *           type: string
 *           example: Netflix
 *         price:
 *           type: number
 *           format: float
 *           example: 15.99
 *         cycle:
 *           type: string
 *           enum: [monthly, yearly]
 *           example: monthly
 *         start_date:
 *           type: string
 *           format: date
 *           example: "2024-01-15"
 *         status:
 *           type: string
 *           enum: [active, cancelled]
 *           example: active
 *         notes:
 *           type: string
 *           example: Premium plan
 *     Summary:
 *       type: object
 *       properties:
 *         monthlyTotal:
 *           type: number
 *           example: 45.97
 *         yearlyTotal:
 *           type: number
 *           example: 120.00
 *         estimatedMonthly:
 *           type: number
 *           example: 55.97
 *         estimatedYearly:
 *           type: number
 *           example: 671.64
 *         activeCount:
 *           type: integer
 *           example: 5
 */

/**
 * @swagger
 * /api/subscriptions/summary:
 *   get:
 *     summary: Get cost summary
 *     tags: [Subscriptions]
 *     responses:
 *       200:
 *         description: Monthly and yearly cost totals
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Summary'
 */
router.get('/summary', async (req, res, next) => {
  try {
    const summary = await subscriptionService.getSummary();
    res.json(summary);
  } catch (err) {
    next(err);
  }
});

/**
 * @swagger
 * /api/subscriptions:
 *   get:
 *     summary: Get all subscriptions
 *     tags: [Subscriptions]
 *     responses:
 *       200:
 *         description: List of all subscriptions
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Subscription'
 */
router.get('/', async (req, res, next) => {
  try {
    const subscriptions = await subscriptionService.getAllSubscriptions();
    res.json(subscriptions);
  } catch (err) {
    next(err);
  }
});

/**
 * @swagger
 * /api/subscriptions/{id}:
 *   get:
 *     summary: Get a subscription by ID
 *     tags: [Subscriptions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: A single subscription
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Subscription'
 *       404:
 *         description: Subscription not found
 */
router.get('/:id', validateId, async (req, res, next) => {
  try {
    const subscription = await subscriptionService.getSubscriptionById(req.params.id);
    res.json(subscription);
  } catch (err) {
    next(err);
  }
});

/**
 * @swagger
 * /api/subscriptions:
 *   post:
 *     summary: Create a new subscription
 *     tags: [Subscriptions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SubscriptionInput'
 *     responses:
 *       201:
 *         description: Created subscription
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Subscription'
 *       400:
 *         description: Validation error
 */
router.post('/', validateCreateSubscription, async (req, res, next) => {
  try {
    const subscription = await subscriptionService.createSubscription(req.body);
    res.status(201).json(subscription);
  } catch (err) {
    next(err);
  }
});

/**
 * @swagger
 * /api/subscriptions/{id}:
 *   put:
 *     summary: Update a subscription
 *     tags: [Subscriptions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SubscriptionInput'
 *     responses:
 *       200:
 *         description: Updated subscription
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Subscription'
 *       400:
 *         description: Validation error
 *       404:
 *         description: Subscription not found
 */
router.put('/:id', validateId, validateUpdateSubscription, async (req, res, next) => {
  try {
    const subscription = await subscriptionService.updateSubscription(req.params.id, req.body);
    res.json(subscription);
  } catch (err) {
    next(err);
  }
});

/**
 * @swagger
 * /api/subscriptions/{id}:
 *   delete:
 *     summary: Delete a subscription
 *     tags: [Subscriptions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Subscription deleted
 *       404:
 *         description: Subscription not found
 */
router.delete('/:id', validateId, async (req, res, next) => {
  try {
    await subscriptionService.deleteSubscription(req.params.id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

module.exports = router;

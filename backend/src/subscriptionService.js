const subscriptionModel = require('./subscriptionModel');

class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

const getAllSubscriptions = async (userId) => {
  return await subscriptionModel.findAll(userId);
};

const getSubscriptionById = async (id, userId) => {
  const subscription = await subscriptionModel.findById(id, userId);
  if (!subscription) {
    throw new AppError('Subscription not found', 404);
  }
  return subscription;
};

const createSubscription = async (userId, data) => {
  return await subscriptionModel.create({ ...data, user_id: userId });
};

const updateSubscription = async (id, userId, data) => {
  const existing = await subscriptionModel.findById(id, userId);
  if (!existing) {
    throw new AppError('Subscription not found', 404);
  }
  return await subscriptionModel.update(id, userId, data);
};

const deleteSubscription = async (id, userId) => {
  const rowCount = await subscriptionModel.remove(id, userId);
  if (rowCount === 0) {
    throw new AppError('Subscription not found', 404);
  }
};

const getSummary = async (userId) => {
  const all = await subscriptionModel.findAll(userId);
  const active = all.filter((s) => s.status === 'active');

  let monthlyTotal = 0;
  let yearlyTotal = 0;

  for (const sub of active) {
    const price = parseFloat(sub.price);
    if (sub.cycle === 'monthly') {
      monthlyTotal += price;
    } else if (sub.cycle === 'yearly') {
      yearlyTotal += price;
    }
  }

  const estimatedMonthly = monthlyTotal + yearlyTotal / 12;
  const estimatedYearly = monthlyTotal * 12 + yearlyTotal;

  return {
    monthlyTotal: parseFloat(monthlyTotal.toFixed(2)),
    yearlyTotal: parseFloat(yearlyTotal.toFixed(2)),
    estimatedMonthly: parseFloat(estimatedMonthly.toFixed(2)),
    estimatedYearly: parseFloat(estimatedYearly.toFixed(2)),
    activeCount: active.length,
  };
};

module.exports = {
  getAllSubscriptions,
  getSubscriptionById,
  createSubscription,
  updateSubscription,
  deleteSubscription,
  getSummary,
  AppError,
};

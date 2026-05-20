const paymentCardModel = require('./paymentCardModel');
const { AppError } = require('./subscriptionService');

const getAllCards = async (userId) => {
  return await paymentCardModel.findAll(userId);
};

const createCard = async (userId, data) => {
  return await paymentCardModel.create({ ...data, user_id: userId });
};

const deleteCard = async (id, userId) => {
  const count = await paymentCardModel.countSubscriptionsByCardId(id, userId);
  if (count > 0) {
    throw new AppError('Cannot delete card with linked subscriptions', 400);
  }
  const rowCount = await paymentCardModel.remove(id, userId);
  if (rowCount === 0) {
    throw new AppError('Card not found', 404);
  }
};

module.exports = { getAllCards, createCard, deleteCard };

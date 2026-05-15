const paymentCardModel = require('./paymentCardModel');
const { AppError } = require('./subscriptionService');

const getAllCards = async () => {
  return await paymentCardModel.findAll();
};

const createCard = async (data) => {
  return await paymentCardModel.create(data);
};

const deleteCard = async (id) => {
  const count = await paymentCardModel.countSubscriptionsByCardId(id);
  if (count > 0) {
    throw new AppError('Cannot delete card with linked subscriptions', 400);
  }
  const rowCount = await paymentCardModel.remove(id);
  if (rowCount === 0) {
    throw new AppError('Card not found', 404);
  }
};

module.exports = { getAllCards, createCard, deleteCard };

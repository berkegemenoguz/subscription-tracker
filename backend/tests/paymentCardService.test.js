jest.mock('../src/paymentCardModel');

const paymentCardModel = require('../src/paymentCardModel');
const paymentCardService = require('../src/paymentCardService');
const { AppError } = require('../src/subscriptionService');

afterEach(() => {
  jest.clearAllMocks();
});

describe('getAllCards', () => {
  it('should return all cards', async () => {
    const mockData = [
      { id: 1, name: 'Ziraat Bankası' },
      { id: 2, name: 'Garanti BBVA' },
    ];
    paymentCardModel.findAll.mockResolvedValue(mockData);

    const result = await paymentCardService.getAllCards();

    expect(result).toEqual(mockData);
    expect(paymentCardModel.findAll).toHaveBeenCalledTimes(1);
  });

  it('should return empty array when no cards exist', async () => {
    paymentCardModel.findAll.mockResolvedValue([]);

    const result = await paymentCardService.getAllCards();

    expect(result).toEqual([]);
  });
});

describe('createCard', () => {
  it('should create and return a new card', async () => {
    const input = { name: 'Yapı Kredi' };
    const mockCreated = { id: 1, name: 'Yapı Kredi', created_at: '2026-05-15T12:00:00.000Z' };
    paymentCardModel.create.mockResolvedValue(mockCreated);

    const result = await paymentCardService.createCard(input);

    expect(result).toEqual(mockCreated);
    expect(paymentCardModel.create).toHaveBeenCalledWith(input);
  });
});

describe('deleteCard', () => {
  it('should delete card when no linked subscriptions', async () => {
    paymentCardModel.countSubscriptionsByCardId.mockResolvedValue(0);
    paymentCardModel.remove.mockResolvedValue(1);

    await expect(paymentCardService.deleteCard(1)).resolves.toBeUndefined();
    expect(paymentCardModel.countSubscriptionsByCardId).toHaveBeenCalledWith(1);
    expect(paymentCardModel.remove).toHaveBeenCalledWith(1);
  });

  it('should throw 400 when card has linked subscriptions', async () => {
    paymentCardModel.countSubscriptionsByCardId.mockResolvedValue(3);

    await expect(paymentCardService.deleteCard(1))
      .rejects.toThrow(AppError);
    await expect(paymentCardService.deleteCard(1))
      .rejects.toThrow('Cannot delete card with linked subscriptions');
    expect(paymentCardModel.remove).not.toHaveBeenCalled();
  });

  it('should throw 404 when card not found', async () => {
    paymentCardModel.countSubscriptionsByCardId.mockResolvedValue(0);
    paymentCardModel.remove.mockResolvedValue(0);

    await expect(paymentCardService.deleteCard(999))
      .rejects.toThrow(AppError);
    await expect(paymentCardService.deleteCard(999))
      .rejects.toThrow('Card not found');
  });
});

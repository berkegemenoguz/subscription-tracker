jest.mock('../src/paymentCardModel');

const paymentCardModel = require('../src/paymentCardModel');
const paymentCardService = require('../src/paymentCardService');
const { AppError } = require('../src/subscriptionService');

const TEST_USER_ID = 1;

afterEach(() => {
  jest.clearAllMocks();
});

describe('getAllCards', () => {
  it('should return all cards for user', async () => {
    const mockData = [
      { id: 1, name: 'Ziraat Bankasi' },
      { id: 2, name: 'Garanti BBVA' },
    ];
    paymentCardModel.findAll.mockResolvedValue(mockData);

    const result = await paymentCardService.getAllCards(TEST_USER_ID);

    expect(result).toEqual(mockData);
    expect(paymentCardModel.findAll).toHaveBeenCalledWith(TEST_USER_ID);
  });

  it('should return empty array when no cards exist', async () => {
    paymentCardModel.findAll.mockResolvedValue([]);

    const result = await paymentCardService.getAllCards(TEST_USER_ID);

    expect(result).toEqual([]);
  });
});

describe('createCard', () => {
  it('should create and return a new card', async () => {
    const input = { name: 'Yapi Kredi' };
    const mockCreated = { id: 1, name: 'Yapi Kredi', created_at: '2026-05-15T12:00:00.000Z', user_id: TEST_USER_ID };
    paymentCardModel.create.mockResolvedValue(mockCreated);

    const result = await paymentCardService.createCard(TEST_USER_ID, input);

    expect(result).toEqual(mockCreated);
    expect(paymentCardModel.create).toHaveBeenCalledWith({ ...input, user_id: TEST_USER_ID });
  });
});

describe('deleteCard', () => {
  it('should delete card when no linked subscriptions', async () => {
    paymentCardModel.countSubscriptionsByCardId.mockResolvedValue(0);
    paymentCardModel.remove.mockResolvedValue(1);

    await expect(paymentCardService.deleteCard(1, TEST_USER_ID)).resolves.toBeUndefined();
    expect(paymentCardModel.countSubscriptionsByCardId).toHaveBeenCalledWith(1, TEST_USER_ID);
    expect(paymentCardModel.remove).toHaveBeenCalledWith(1, TEST_USER_ID);
  });

  it('should throw 400 when card has linked subscriptions', async () => {
    paymentCardModel.countSubscriptionsByCardId.mockResolvedValue(3);

    await expect(paymentCardService.deleteCard(1, TEST_USER_ID))
      .rejects.toThrow(AppError);
    await expect(paymentCardService.deleteCard(1, TEST_USER_ID))
      .rejects.toThrow('Cannot delete card with linked subscriptions');
    expect(paymentCardModel.remove).not.toHaveBeenCalled();
  });

  it('should throw 404 when card not found', async () => {
    paymentCardModel.countSubscriptionsByCardId.mockResolvedValue(0);
    paymentCardModel.remove.mockResolvedValue(0);

    await expect(paymentCardService.deleteCard(999, TEST_USER_ID))
      .rejects.toThrow(AppError);
    await expect(paymentCardService.deleteCard(999, TEST_USER_ID))
      .rejects.toThrow('Card not found');
  });
});

jest.mock('../src/subscriptionModel');

const subscriptionModel = require('../src/subscriptionModel');
const subscriptionService = require('../src/subscriptionService');
const { AppError } = require('../src/subscriptionService');

const TEST_USER_ID = 1;

afterEach(() => {
  jest.clearAllMocks();
});

describe('getAllSubscriptions', () => {
  it('should return all subscriptions for user', async () => {
    const mockData = [
      { id: 1, name: 'Netflix', price: '15.99', cycle: 'monthly', status: 'active' },
      { id: 2, name: 'Spotify', price: '9.99', cycle: 'monthly', status: 'active' },
    ];
    subscriptionModel.findAll.mockResolvedValue(mockData);

    const result = await subscriptionService.getAllSubscriptions(TEST_USER_ID);

    expect(result).toEqual(mockData);
    expect(subscriptionModel.findAll).toHaveBeenCalledWith(TEST_USER_ID);
  });

  it('should return empty array when no subscriptions exist', async () => {
    subscriptionModel.findAll.mockResolvedValue([]);

    const result = await subscriptionService.getAllSubscriptions(TEST_USER_ID);

    expect(result).toEqual([]);
  });
});

describe('getSubscriptionById', () => {
  it('should return subscription when found', async () => {
    const mockSub = { id: 1, name: 'Netflix', price: '15.99' };
    subscriptionModel.findById.mockResolvedValue(mockSub);

    const result = await subscriptionService.getSubscriptionById(1, TEST_USER_ID);

    expect(result).toEqual(mockSub);
    expect(subscriptionModel.findById).toHaveBeenCalledWith(1, TEST_USER_ID);
  });

  it('should throw 404 when subscription not found', async () => {
    subscriptionModel.findById.mockResolvedValue(undefined);

    await expect(subscriptionService.getSubscriptionById(999, TEST_USER_ID))
      .rejects.toThrow(AppError);
    await expect(subscriptionService.getSubscriptionById(999, TEST_USER_ID))
      .rejects.toThrow('Subscription not found');
  });
});

describe('createSubscription', () => {
  it('should create and return new subscription', async () => {
    const input = {
      name: 'Netflix',
      price: 15.99,
      cycle: 'monthly',
      start_date: '2024-01-15',
    };
    const mockCreated = { id: 1, ...input, status: 'active', notes: null, user_id: TEST_USER_ID };
    subscriptionModel.create.mockResolvedValue(mockCreated);

    const result = await subscriptionService.createSubscription(TEST_USER_ID, input);

    expect(result).toEqual(mockCreated);
    expect(subscriptionModel.create).toHaveBeenCalledWith({ ...input, user_id: TEST_USER_ID });
  });
});

describe('updateSubscription', () => {
  it('should update and return subscription when found', async () => {
    const existing = { id: 1, name: 'Netflix', price: '15.99' };
    const updateData = { price: 19.99 };
    const updated = { ...existing, price: '19.99' };

    subscriptionModel.findById.mockResolvedValue(existing);
    subscriptionModel.update.mockResolvedValue(updated);

    const result = await subscriptionService.updateSubscription(1, TEST_USER_ID, updateData);

    expect(result).toEqual(updated);
    expect(subscriptionModel.findById).toHaveBeenCalledWith(1, TEST_USER_ID);
    expect(subscriptionModel.update).toHaveBeenCalledWith(1, TEST_USER_ID, updateData);
  });

  it('should throw 404 when subscription not found', async () => {
    subscriptionModel.findById.mockResolvedValue(undefined);

    await expect(subscriptionService.updateSubscription(999, TEST_USER_ID, { price: 10 }))
      .rejects.toThrow(AppError);
    await expect(subscriptionService.updateSubscription(999, TEST_USER_ID, { price: 10 }))
      .rejects.toThrow('Subscription not found');
  });
});

describe('deleteSubscription', () => {
  it('should delete subscription when found', async () => {
    subscriptionModel.remove.mockResolvedValue(1);

    await expect(subscriptionService.deleteSubscription(1, TEST_USER_ID)).resolves.toBeUndefined();
    expect(subscriptionModel.remove).toHaveBeenCalledWith(1, TEST_USER_ID);
  });

  it('should throw 404 when subscription not found', async () => {
    subscriptionModel.remove.mockResolvedValue(0);

    await expect(subscriptionService.deleteSubscription(999, TEST_USER_ID))
      .rejects.toThrow(AppError);
    await expect(subscriptionService.deleteSubscription(999, TEST_USER_ID))
      .rejects.toThrow('Subscription not found');
  });
});

describe('getSummary', () => {
  it('should calculate correct totals for active subscriptions', async () => {
    const mockData = [
      { id: 1, name: 'Netflix', price: '15.99', cycle: 'monthly', status: 'active' },
      { id: 2, name: 'Spotify', price: '9.99', cycle: 'monthly', status: 'active' },
      { id: 3, name: 'Adobe CC', price: '120.00', cycle: 'yearly', status: 'active' },
      { id: 4, name: 'Old Service', price: '5.00', cycle: 'monthly', status: 'cancelled' },
    ];
    subscriptionModel.findAll.mockResolvedValue(mockData);

    const result = await subscriptionService.getSummary(TEST_USER_ID);

    expect(result.monthlyTotal).toBe(25.98);
    expect(result.yearlyTotal).toBe(120.00);
    expect(result.estimatedMonthly).toBe(35.98);
    expect(result.estimatedYearly).toBe(431.76);
    expect(result.activeCount).toBe(3);
    expect(subscriptionModel.findAll).toHaveBeenCalledWith(TEST_USER_ID);
  });

  it('should return zeros when no active subscriptions', async () => {
    subscriptionModel.findAll.mockResolvedValue([]);

    const result = await subscriptionService.getSummary(TEST_USER_ID);

    expect(result.monthlyTotal).toBe(0);
    expect(result.yearlyTotal).toBe(0);
    expect(result.estimatedMonthly).toBe(0);
    expect(result.estimatedYearly).toBe(0);
    expect(result.activeCount).toBe(0);
  });

  it('should exclude cancelled subscriptions from totals', async () => {
    const mockData = [
      { id: 1, name: 'Netflix', price: '15.99', cycle: 'monthly', status: 'cancelled' },
      { id: 2, name: 'Spotify', price: '9.99', cycle: 'monthly', status: 'cancelled' },
    ];
    subscriptionModel.findAll.mockResolvedValue(mockData);

    const result = await subscriptionService.getSummary(TEST_USER_ID);

    expect(result.monthlyTotal).toBe(0);
    expect(result.yearlyTotal).toBe(0);
    expect(result.estimatedYearly).toBe(0);
    expect(result.activeCount).toBe(0);
  });
});

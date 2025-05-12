import {
  getBankAccount,
  InsufficientFundsError,
  SynchronizationFailedError,
  TransferFailedError,
} from '.';

describe('BankAccount', () => {
  test('should create account with initial balance', () => {
    const initialBalance = 100;
    const account = getBankAccount(initialBalance);

    expect(account.getBalance()).toBe(initialBalance);
  });

  test('should throw InsufficientFundsError error when withdrawing more than balance', () => {
    const account = getBankAccount(200);

    expect(() => account.withdraw(300)).toThrow(InsufficientFundsError);
  });

  test('should throw error when transferring more than balance', () => {
    const account = getBankAccount(200);
    const anotherAccount = getBankAccount(0);

    expect(() => account.transfer(300, anotherAccount)).toThrow(
      InsufficientFundsError,
    );
  });

  test('should throw error when transferring to the same account', () => {
    const account = getBankAccount(100);

    expect(() => account.transfer(50, account)).toThrow(TransferFailedError);
  });

  test('should deposit money', () => {
    const account = getBankAccount(200);
    account.deposit(100);

    expect(account.getBalance()).toBe(300);
  });

  test('should withdraw money', () => {
    const account = getBankAccount(200);
    account.withdraw(100);

    expect(account.getBalance()).toBe(100);
  });

  test('should transfer money', () => {
    const accountA = getBankAccount(200);
    const accountB = getBankAccount(100);
    accountA.transfer(50, accountB);

    expect(accountA.getBalance()).toBe(150);
    expect(accountB.getBalance()).toBe(150);
  });

  test('fetchBalance should return number in case if request did not failed', async () => {
    const account = getBankAccount(200);
    const balance = await account.fetchBalance();
    expect(balance).toBe(balance);
  });

  test('should set new balance if fetchBalance returned number', async () => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const _ = require('lodash');
    jest.spyOn(_, 'random').mockImplementation(() => 50);
    const newBalance = _.random();
    expect(newBalance).toBe(50);
  });

  test('should throw SynchronizationFailedError if fetchBalance returned null', async () => {
    const account = getBankAccount(100);
    jest.spyOn(account, 'fetchBalance').mockResolvedValue(null);

    await expect(account.synchronizeBalance()).rejects.toThrow(
      SynchronizationFailedError,
    );
  });
});

import { generateLinkedList } from './index';

describe('generateLinkedList', () => {
  test('should generate linked list from values 1', () => {
    const elements = [1, 2, 3];
    const expected = {
      value: 1,
      next: {
        value: 2,
        next: {
          value: 3,
          next: {
            value: null,
            next: null,
          },
        },
      },
    };
    expect(generateLinkedList(elements)).toStrictEqual(expected);
  });

  test('should generate linked list from values 2', () => {
    const elements = ['a', 'b', 'c'];
    const list = generateLinkedList(elements);
    expect(list).toMatchSnapshot();
  });
});

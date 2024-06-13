import { generateUser } from '../__tests__/fixtures/user-generator';
import { toCamelCaseObjectKeys } from './json';

describe('json.ts/toCamelCaseObjectKeys', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should parse JSON with snake_case keys to camelCase keys', () => {
    const jsonString =
      '{ "first_name": "John", "last_name": "Doe", "address": { "street_name": "Main St" }}';

    type Address = {
      streetName: string;
    };

    type Person = {
      firstName: string;
      lastName: string;
      address: Address;
    };

    const result = toCamelCaseObjectKeys<Person>(JSON.parse(jsonString));
    expect(result).toEqual({
      firstName: 'John',
      lastName: 'Doe',
      address: {
        streetName: 'Main St',
      },
    });
  });

  test('should handle nested objects with snake_case keys', () => {
    const nestedJsonString =
      '{"user_info": {"user_name": "Alice", "user_age": 30}, "account_details": {"account_number": "12345"}}';

    type AccountDetails = {
      accountNumber: string;
    };

    type UserInfo = {
      userName: string;
      userAge: number;
    };

    type NestedObject = {
      userInfo: UserInfo;
      accountDetails: AccountDetails;
    };

    const result: NestedObject = toCamelCaseObjectKeys<NestedObject>(
      JSON.parse(nestedJsonString),
    );

    expect(result).toEqual({
      userInfo: {
        userName: 'Alice',
        userAge: 30,
      },
      accountDetails: {
        accountNumber: '12345',
      },
    });
  });

  test('should return an empty object for empty JSON', () => {
    const result = toCamelCaseObjectKeys<any>(JSON.parse('{}'));
    expect(result).toEqual({});
  });

  test('should correctly parse an array of objects with snake_case keys', () => {
    const arrayJsonString =
      '[{"item_name": "Item1", "item_price": 10}, {"item_name": "Item2", "item_price": 20}]';

    type Item = {
      itemName: string;
      itemPrice: number;
    };

    const result: Item[] = toCamelCaseObjectKeys<Item[]>(
      JSON.parse(arrayJsonString),
    );

    expect(result).toEqual([
      { itemName: 'Item1', itemPrice: 10 },
      { itemName: 'Item2', itemPrice: 20 },
    ]);
  });

  test('should correctly parse a mixed list of valid json values', () => {
    const mixedArrayJsonString =
      '[{"item_name": "Item1"}, 10, {"l_1": {"second_level": false, "third_level": true}}, null, "foo_bar"]';

    const result = toCamelCaseObjectKeys(JSON.parse(mixedArrayJsonString));

    expect(result).toEqual([
      { itemName: 'Item1' },
      10,
      { l1: { secondLevel: false, thirdLevel: true } },
      null,
      'foo_bar',
    ]);
  });

  test('should throw when the given value is not an object or array', () => {
    const nonValidValueTypes = ['null', 'false', 'true', 'foo_bar', '0'];
    const target = { toCamelCaseObjectKeys };
    const spyOnSubject = jest.spyOn(target, 'toCamelCaseObjectKeys');

    for (const v of nonValidValueTypes) {
      try {
        toCamelCaseObjectKeys(JSON.parse(v));
      } catch {
        // skip...
      }

      expect(spyOnSubject).toThrow(/Illegal argument exception/);
    }
  });
  test('should process large payloads in a feasible time', () => {
    const users = [] as Array<any>;
    const MAX_ITEMS = 71_659;

    for (let userId = 1; userId <= MAX_ITEMS; userId++) {
      users.push(generateUser(userId));
    }

    const result = toCamelCaseObjectKeys<Array<any>>(users);

    expect(JSON.stringify(result).includes('_')).toBe(false);
  });
});

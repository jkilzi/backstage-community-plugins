import camelCase from 'lodash/camelCase';
import { mockRecommendationsList } from '../__tests__/fixtures/responses';
import type { RecommendationList } from '../generated/models';
import { deepMapKeys } from './json';

describe('json.ts/deepMapKeys', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should parse JSON with snake_case keys to camelCase keys', () => {
    const jsonString =
      '{ "first_name": "John", "last_name": "Doe", "address": { "street_name": "Main St" }}';

    const result = deepMapKeys(JSON.parse(jsonString), camelCase);
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

    const result = deepMapKeys(JSON.parse(nestedJsonString), camelCase);

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
    const result = deepMapKeys(JSON.parse('{}'));
    expect(result).toEqual({});
  });

  test('should correctly parse an array of objects with snake_case keys', () => {
    const arrayJsonString =
      '[{"item_name": "Item1", "item_price": 10}, {"item_name": "Item2", "item_price": 20}]';

    const result = deepMapKeys(
      JSON.parse(arrayJsonString),
      camelCase,
    );

    expect(result).toEqual([
      { itemName: 'Item1', itemPrice: 10 },
      { itemName: 'Item2', itemPrice: 20 },
    ]);
  });

  test('should correctly parse a mixed list of valid json values', () => {
    const mixedArrayJsonString =
      '[{"item_name": "Item1"}, 10, {"l_1": {"second_level": false, "third_level": true}}, null, "foo_bar"]';

    const result = deepMapKeys(JSON.parse(mixedArrayJsonString), camelCase);

    expect(result).toEqual([
      { itemName: 'Item1' },
      10,
      { l1: { secondLevel: false, thirdLevel: true } },
      null,
      'foo_bar',
    ]);
  });

  test('should return the same value when the given value is a JSON primitive value', () => {
    const primitiveValues = [null, false, true, 'some_string', 42];

    for (const v of primitiveValues) {
      expect(deepMapKeys(v, camelCase)).toEqual(v);
    }
  });

  test('should process large JSON payloads in a feasible time', () => {
    const mockResponse = {
      data: [mockRecommendationsList.data[0]],
      meta: mockRecommendationsList.meta,
      links: mockRecommendationsList.links,
    };
    const [recommendation] = (
      deepMapKeys(mockResponse, camelCase) as RecommendationList
    ).data!;

    expect(Object.keys(recommendation).every(k => !k.includes('_'))).toBe(true);
  });
});

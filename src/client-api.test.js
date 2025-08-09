jest.mock('axios', () => ({ get: jest.fn() }), { virtual: true });
jest.mock('./formats', () => ({ utcParse: jest.fn() }), { virtual: true });
jest.mock('d3', () => ({}), { virtual: true });

const axios = require('axios');
const { fetchData } = require('./client-api');

describe('fetchData', () => {
  it('constructs the correct URL and returns data', async () => {
    const mockResponse = { data: { result: 'ok' } };
    axios.get.mockResolvedValue(mockResponse);

    const token = ['alice', 'token123'];
    const type = 'daily';
    const start = '2024-01-01';
    const end = '2024-01-31';

    const data = await fetchData(token, type, start, end);

    expect(axios.get).toHaveBeenCalledWith(
      `http://localhost:9000/?name=${token[0]}&token=${token[1]}&type=${type}&start=${start}&end=${end}`
    );
    expect(data).toEqual(mockResponse.data);
  });
});

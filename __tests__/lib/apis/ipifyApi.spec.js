const mockAxios = require('axios');
const underTest = require('../../../lib/apis/ipifyApi');

jest.mock('axios');

describe('ipifyApi', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getPublicIP', () => {
    it('should call the correct API', async () => {
      mockAxios.get.mockResolvedValue('any-ip-address');

      await expect(underTest.getPublicIP()).resolves.toMatchInlineSnapshot(
        `undefined`
      );
      expect(mockAxios.get.mock.calls).toMatchInlineSnapshot(`
        Array [
          Array [
            "https://api.ipify.org/",
            Object {
              "responseType": "text",
            },
          ],
        ]
      `);
    });

    it('should reject when api call rejects', async () => {
      mockAxios.get.mockRejectedValue(new Error('any-get-error'));
      await expect(underTest.getPublicIP()).rejects.toMatchInlineSnapshot(
        `[Error: any-get-error]`
      );
      expect(mockAxios.get).toHaveBeenCalledTimes(1);
    });
  });
});

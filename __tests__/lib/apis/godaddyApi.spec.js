const mockAxios = require('axios');
const underTest = require('../../../lib/apis/godaddyApi');

jest.mock('axios');

describe('godaddyApi', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.GODADDY_API_KEY = 'any-godaddy-api-key';
    process.env.GODADDY_API_SECRET = 'any-godaddy-api-secret';
    mockAxios.create.mockReturnValue(mockAxios);
  });

  describe('getDnsRecord', () => {
    it('should call the correct endpoint', async () => {
      mockAxios.get.mockResolvedValue({ data: ['first-record'] });

      await expect(
        underTest.getDnsRecord({
          domain: 'www.example.com',
          type: 'any-type',
          name: 'any-name',
        })
      ).resolves.toMatchInlineSnapshot(`"first-record"`);
      expect(mockAxios.create.mock.calls).toMatchInlineSnapshot(`
        Array [
          Array [
            Object {
              "baseURL": "https://api.godaddy.com",
              "headers": Object {
                "Authorization": "sso-key any-godaddy-api-key:any-godaddy-api-secret",
              },
            },
          ],
        ]
      `);
      expect(mockAxios.get.mock.calls).toMatchInlineSnapshot(`
        Array [
          Array [
            "/v1/domains/www.example.com/records/any-type/any-name",
          ],
        ]
      `);
    });

    it('should throw an error when more than one record was returned', async () => {
      mockAxios.get.mockResolvedValue({
        data: ['first-record', 'second-record'],
      });
      await expect(
        underTest.getDnsRecord({
          domain: 'www.example.com',
          type: 'any-type',
          name: 'any-name',
        })
      ).rejects.toMatchInlineSnapshot(
        `[Error: More than one record found for type "any-type" and name "any-name"]`
      );
      expect(mockAxios.get).toHaveBeenCalledTimes(1);
    });

    it('should reject when api call rejects', async () => {
      mockAxios.get.mockRejectedValue(new Error('any-get-error'));
      await expect(
        underTest.getDnsRecord({
          domain: 'www.example.com',
          type: 'any-type',
          name: 'any-name',
        })
      ).rejects.toMatchInlineSnapshot(`[Error: any-get-error]`);
      expect(mockAxios.get).toHaveBeenCalledTimes(1);
    });
  });

  describe('replaceDnsRecords', () => {
    it('should call the correct endpoint', async () => {
      mockAxios.put.mockResolvedValue('any-put-response');

      await expect(
        underTest.replaceDnsRecords({
          domain: 'www.example.com',
          type: 'any-type',
          name: 'any-name',
          records: 'any-new-records',
        })
      ).resolves.toMatchInlineSnapshot(`"any-put-response"`);
      expect(mockAxios.put.mock.calls).toMatchInlineSnapshot(`
        Array [
          Array [
            "/v1/domains/www.example.com/records/any-type/any-name",
            "any-new-records",
          ],
        ]
      `);
    });

    it('should reject when api call rejects', async () => {
      mockAxios.put.mockRejectedValue(new Error('any-put-error'));
      await expect(
        underTest.replaceDnsRecords({
          domain: 'www.example.com',
          type: 'any-type',
          name: 'any-name',
          records: 'any-new-records',
        })
      ).rejects.toMatchInlineSnapshot(`[Error: any-put-error]`);
      expect(mockAxios.put).toHaveBeenCalledTimes(1);
    });
  });
});

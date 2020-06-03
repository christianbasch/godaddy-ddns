const mockGodaddyApi = require('../../lib/apis/godaddyApi');
const mockIpifyApi = require('../../lib/apis/ipifyApi');
const underTest = require('../../lib/dnsRecordUpdater');

jest.mock('../../lib/apis/godaddyApi');
jest.mock('../../lib/apis/ipifyApi');

describe('dnsRecordUpdater', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should not update DNS record when the IP address on record matches the current public IP address', async () => {
    mockGodaddyApi.getDnsRecord.mockResolvedValue({ data: 'any-ip-address' });
    mockIpifyApi.getPublicIP.mockResolvedValue('any-ip-address');

    await underTest({
      domain: 'www.example.com',
      type: 'any-type',
      name: 'any-name',
    })();
    expect(mockGodaddyApi.getDnsRecord.mock.calls).toMatchInlineSnapshot(`
      Array [
        Array [
          Object {
            "domain": "www.example.com",
            "name": "any-name",
            "type": "any-type",
          },
        ],
      ]
    `);
    expect(mockIpifyApi.getPublicIP).toHaveBeenCalled();
    expect(mockGodaddyApi.replaceDnsRecords).not.toHaveBeenCalled();
  });

  it('should update DNS record when the IP addresses do not match', async () => {
    mockGodaddyApi.getDnsRecord.mockResolvedValue({ data: 'any-ip-address' });
    mockIpifyApi.getPublicIP.mockResolvedValue('any-new-ip-address');

    await underTest({
      domain: 'www.example.com',
      type: 'any-type',
      name: 'any-name',
    })();
    expect(mockGodaddyApi.getDnsRecord).toHaveBeenCalled();
    expect(mockIpifyApi.getPublicIP).toHaveBeenCalled();
    expect(mockGodaddyApi.replaceDnsRecords.mock.calls).toMatchInlineSnapshot(`
      Array [
        Array [
          Object {
            "domain": "www.example.com",
            "name": "any-name",
            "records": Array [
              Object {
                "data": "any-new-ip-address",
                "ttl": 600,
              },
            ],
            "type": "any-type",
          },
        ],
      ]
    `);
  });

  it('should reject when call to ipifyApi failed', async () => {
    mockIpifyApi.getPublicIP.mockRejectedValueOnce(new Error('any-error'));
    await expect(
      underTest({
        domain: 'www.example.com',
        type: 'any-type',
        name: 'any-name',
      })()
    ).rejects.toMatchInlineSnapshot(`[Error: any-error]`);
    expect(mockGodaddyApi.replaceDnsRecords).not.toHaveBeenCalled();
  });

  it('should reject when fetching DNS record failed', async () => {
    mockGodaddyApi.getDnsRecord.mockRejectedValueOnce(new Error('any-error'));
    await expect(
      underTest({
        domain: 'www.example.com',
        type: 'any-type',
        name: 'any-name',
      })()
    ).rejects.toMatchInlineSnapshot(`[Error: any-error]`);
    expect(mockGodaddyApi.replaceDnsRecords).not.toHaveBeenCalled();
  });

  it('should reject when replacing DNS records failed', async () => {
    mockGodaddyApi.getDnsRecord.mockResolvedValue({ data: 'any-ip-address' });
    mockIpifyApi.getPublicIP.mockResolvedValue('any-new-ip-address');
    mockGodaddyApi.replaceDnsRecords.mockRejectedValueOnce(
      new Error('any-error')
    );

    await expect(
      underTest({
        domain: 'www.example.com',
        type: 'any-type',
        name: 'any-name',
      })()
    ).rejects.toMatchInlineSnapshot(`[Error: any-error]`);
  });
});

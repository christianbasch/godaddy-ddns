const mockNodeCron = require('node-cron');
const mockDnsRecordUpdater = require('../lib/dnsRecordUpdater');
const underTest = () => require('../index');

jest.mock('node-cron');
jest.mock('../lib/dnsRecordUpdater');

const mockNestedDnsRecordUpdater = jest.fn();

describe('index - main entry point', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockNestedDnsRecordUpdater.mockResolvedValue('any-nested-response');
    mockDnsRecordUpdater.mockReturnValue(mockNestedDnsRecordUpdater);
    process.env.CRON_SCHEDULE = 'any-cron-schedule';
    process.env.GODADDY_DOMAIN = 'www.example.com';
  });

  it('should call node-cron.schedule with the correct parameters', async () => {
    underTest();
    expect(mockNodeCron.schedule).toHaveBeenCalledWith(
      'any-cron-schedule',
      mockNestedDnsRecordUpdater
    );
    expect(mockDnsRecordUpdater.mock.calls).toMatchInlineSnapshot(`
      Array [
        Array [
          Object {
            "domain": "www.example.com",
            "name": "@",
            "type": "A",
          },
        ],
      ]
    `);
  });
});

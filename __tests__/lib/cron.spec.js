const mockNodeCron = require('node-cron');
const mockDnsRecordUpdater = require('../../lib/dnsRecordUpdater');
const underTest = require('../../lib/cron');

jest.mock('node-cron');
jest.mock('../../lib/dnsRecordUpdater');
jest.mock('../../lib/logger');

const mockNestedDnsRecordUpdater = jest.fn();

describe('cron.schedule', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockNestedDnsRecordUpdater.mockResolvedValue('any-nested-response');
    mockDnsRecordUpdater.mockReturnValue(mockNestedDnsRecordUpdater);
    process.env.CRON_SCHEDULE = 'any-cron-schedule';
    process.env.GODADDY_DOMAIN = 'www.example.com';
  });

  it('should call node-cron.schedule with the correct parameters', async () => {
    underTest.schedule();
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

  it('should call node-cron.schedule with the default value when CRON_SCHEDULE env var is not set', async () => {
    delete process.env.CRON_SCHEDULE;
    underTest.schedule();
    expect(mockNodeCron.schedule).toHaveBeenCalledWith(
      '*/30 * * * *',
      mockNestedDnsRecordUpdater
    );
    expect(mockDnsRecordUpdater).toHaveBeenCalled();
  });
});

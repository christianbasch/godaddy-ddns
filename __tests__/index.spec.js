const mockCron = require('../lib/cron');

// eslint-disable-next-line global-require
const underTest = () => require('../index');

jest.mock('../lib/cron');
jest.mock('../lib/logger');

describe('index - main entry point', () => {
  it('should call cron.schedule', async () => {
    underTest();
    expect(mockCron.schedule).toHaveBeenCalled();
  });
});

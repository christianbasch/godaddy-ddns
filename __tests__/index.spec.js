const mockCron = require('../lib/cron');
const underTest = () => require('../index');

jest.mock('../lib/cron');

describe('index - main entry point', () => {
  it('should call cron.schedule', async () => {
    underTest();
    expect(mockCron.schedule).toHaveBeenCalled();
  });
});

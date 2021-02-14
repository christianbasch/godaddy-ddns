const cron = require('node-cron');
const dnsRecordUpdater = require('./dnsRecordUpdater');
const logger = require('./logger');

const EVERY_30_MINUTES = '*/30 * * * *';

module.exports = {
  schedule: () => {
    const cronExpression = process.env.CRON_SCHEDULE || EVERY_30_MINUTES;
    logger.info(`Cron Schedule: ${cronExpression}`);
    return cron.schedule(
      cronExpression,
      dnsRecordUpdater({
        domain: process.env.GODADDY_DOMAIN,
        type: 'A',
        name: '@',
      })
    );
  },
};

const cron = require('./lib/cron');
const logger = require('./lib/logger');

logger.info('GoDaddy DDNS Updater started!');
logger.info(`Domain: ${process.env.GODADDY_DOMAIN}`);

cron.schedule();

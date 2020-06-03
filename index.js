const cron = require('./lib/cron');

console.log('GoDaddy DDNS Updater started!');
console.log(`Domain: ${process.env.GODADDY_DOMAIN}`);

cron.schedule();

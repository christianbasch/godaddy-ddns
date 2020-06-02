const cron = require('node-cron');
const dnsRecordUpdater = require('./lib/dnsRecordUpdater')

console.log('GoDaddy DDNS Updater started!')
console.log(`Domain: ${process.env.GODADDY_DOMAIN}`)
console.log(`Cron Schedule: ${process.env.CRON_SCHEDULE}`)

cron.schedule(process.env.CRON_SCHEDULE, dnsRecordUpdater);

const godaddyApi = require('./lib/godaddyApi');
const ipifyApi = require('./lib/ipfiyApi');
const cron = require('node-cron');

const handleError = (error) => {
  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    console.log(error.response.data);
    console.log(error.response.status);
    console.log(error.response.headers);
  } else if (error.request) {
    // The request was made but no response was received
    console.log(error.request);
  } else {
    // Something happened in setting up the request that triggered an Error
    console.log('Error', error.message);
  }
  console.log(error.config);
};

console.log('GoDaddy DDNS Updater started!')
console.log(`Domain: ${process.env.GODADDY_DOMAIN}`)
console.log(`Cron Schedule: ${process.env.CRON_SCHEDULE}`)

cron.schedule(process.env.CRON_SCHEDULE, async () => {
  try {
    const [currentIpAddress, { data: ipAddressOnRecord }] = await Promise.all([
      ipifyApi.getPublicIP(),
      godaddyApi.getDnsRecord({
        domain: process.env.GODADDY_DOMAIN,
        type: 'A',
        name: '@',
      }),
    ]);

    if (ipAddressOnRecord != currentIpAddress) {
      console.log(
        `Current IP address ${currentIpAddress} matches the GoDaddy record. Skipping update!`
      );
      return;
    }

    console.log(
      `Current IP ${currentIpAddress} differs from GoDaddy record ${ipAddressOnRecord}. Updating record!`
    );
    await godaddyApi.replaceDnsRecords({
      domain: process.env.GODADDY_DOMAIN,
      type: 'A',
      name: '@',
      records: [{ data: currentIpAddress, ttl: 600 }],
    });

    console.log('DNS record updated successfully');
  } catch (error) {
    handleError(error);
  }
});

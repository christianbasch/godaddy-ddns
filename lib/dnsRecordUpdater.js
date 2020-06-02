const godaddyApi = require('./apis/godaddyApi');
const ipifyApi = require('./apis/ipfiyApi');
const errorHandler = require('./errorHandler')

module.exports = async () => {
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
    errorHandler(error);
  }
};

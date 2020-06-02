const godaddyApi = require('./apis/godaddyApi');
const ipifyApi = require('./apis/ipfiyApi');
const errorHandler = require('./errorHandler')

const fromDnsRecord = ({ data: ipAddressOnRecord }) => ipAddressOnRecord;
const toDnsRecord = (ipAddress) => ({ data: ipAddress, ttl: 600 });

module.exports = ({ domain, type, name }) => async () => {
  try {
    const [currentIpAddress, dnsRecord] = await Promise.all([
      ipifyApi.getPublicIP(),
      godaddyApi.getDnsRecord({ domain, type, name }),
    ]);

    const ipAddressOnRecord = fromDnsRecord(dnsRecord);
    if (ipAddressOnRecord === currentIpAddress) {
      console.log(
        `Current IP address ${currentIpAddress} matches the GoDaddy record. Skipping update!`
      );
      return;
    }

    console.log(
      `Current IP ${currentIpAddress} differs from GoDaddy record ${ipAddressOnRecord}. Updating record!`
    );
    await godaddyApi.replaceDnsRecords({
      domain,
      type,
      name,
      records: [toDnsRecord(currentIpAddress)],
    });

    console.log('DNS record updated successfully');
  } catch (error) {
    errorHandler(error);
  }
};

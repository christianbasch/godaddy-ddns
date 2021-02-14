const godaddyApi = require('./apis/godaddyApi');
const ipifyApi = require('./apis/ipifyApi');
const logger = require('./logger');

const fromDnsRecord = ({ data: ipAddressOnRecord }) => ipAddressOnRecord;
const toDnsRecord = (ipAddress) => ({ data: ipAddress, ttl: 600 });

module.exports = ({ domain, type, name }) => async () => {
  const [currentIpAddress, dnsRecord] = await Promise.all([
    ipifyApi.getPublicIP(),
    godaddyApi.getDnsRecord({ domain, type, name }),
  ]);

  const ipAddressOnRecord = fromDnsRecord(dnsRecord);
  if (ipAddressOnRecord === currentIpAddress) {
    logger.info(
      `Current IP address ${currentIpAddress} matches the GoDaddy record. Skipping update!`
    );
    return;
  }

  logger.info(
    `Current IP ${currentIpAddress} differs from GoDaddy record ${ipAddressOnRecord}. Updating record!`
  );
  await godaddyApi.replaceDnsRecords({
    domain,
    type,
    name,
    records: [toDnsRecord(currentIpAddress)],
  });

  logger.info('DNS record updated successfully');
};

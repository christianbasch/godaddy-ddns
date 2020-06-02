const axios = require('axios').default;

let instance;

const getInstance = () => {
  if (!instance) {
    instance = axios.create({
      baseURL: 'https://api.godaddy.com',
      headers: {
        Authorization: `sso-key ${process.env.GODADDY_API_KEY}:${process.env.GODADDY_API_SECRET}`,
      },
    });
  }
  return instance;
};

async function getDnsRecord({ domain, type, name }) {
  const { data } = await getInstance().get(
    `/v1/domains/${domain}/records/${type}/${name}`
  );
  return data;
}

async function replaceDnsRecords({ domain, type, name, records }) {
  return getInstance().put(
    `/v1/domains/${domain}/records/${type}/${name}`,
    records
  );
}

module.exports = {
  getDnsRecord,
  replaceDnsRecords,
};

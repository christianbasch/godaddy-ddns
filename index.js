const axios = require('axios').default;

const instance = axios.create({
  baseURL: 'https://api.godaddy.com',
  headers: {
    Authorization: `sso-key ${process.env.GODADDY_API_KEY}:${process.env.GODADDY_API_SECRET}`,
  },
});

function getCurrentRecord(domain, type, name) {
  return instance.get(`/v1/domains/${domain}/records/${type}/${name}`);
}

getCurrentRecord(process.env.GODADDY_DOMAIN, 'A', '@')
  .then(({ data }) => console.log(data))
  .catch((error) => {
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
  });

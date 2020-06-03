const axios = require('axios').default;

module.exports = {
  getPublicIP: async () => {
    const { data } = await axios.get('https://api.ipify.org/', {
      responseType: 'text',
    });
    return data;
  },
};

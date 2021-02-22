# godaddy-ddns

A NodeJS-based Docker container for updating your GoDaddy domain with the IP address of the host the contaienr is running on.
Once started, it runs at the specified interval and updates the DNS record for the given domain when the IP address has changed.

### Usage

#### docker-compose

```
---
version: "3.7"
services:
  godaddy-ddns:
    image: ghcr.io/christianbasch/godaddy-ddns:latest
    environment:
      - GODADDY_API_KEY=your-godaddy-api-key
      - GODADDY_API_SECRET=your-godaddy-api-secret
      - GODADDY_DOMAIN=example.com
      - CRON_SCHEDULE=*/30 * * * *
    restart: unless-stopped
```

#### docker cli
```
docker run -d \
  --name=godaddy-ddns \
  -e GODADDY_DOMAIN=example.com \
  -e GODADDY_API_KEY=your-godaddy-api-key \
  -e GODADDY_API_SECRET=your-godaddy-api-secret \
  -e CRON_SCHEDULE=*/30 * * * * \
  --restart unless-stopped \
  ghcr.io/christianbasch/godaddy-ddns
```


#### Environment Variables

* `GODADDY_DOMAIN` - Your GoDaddy domain without subdomain (e.g. example.com)
* `GODADDY_API_KEY` - Your Godaddy API key
* `GODADDY_API_SECRET` - Your Godaddy API secret
* `CRON_SCHEDULE` - How often your IP address will be checked against the DNS record

## Find Us

* [GitHub](https://github.com/christianbasch/godaddy-ddns)
* [ghcr.io](https://ghcr.io/christianbasch/godaddy-ddns)

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

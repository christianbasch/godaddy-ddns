FROM node:12-alpine

RUN apk add --no-cache tini
# Tini is now available at /sbin/tini

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install --production

COPY . .

ENTRYPOINT ["/sbin/tini", "--"]
CMD node index.js

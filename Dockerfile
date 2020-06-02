FROM node:12-alpine

RUN apk add --no-cache tini
# Tini is now available at /sbin/tini

USER node
WORKDIR /home/node

COPY --chown=node:node package.json package-lock.json ./
RUN npm install --production

COPY --chown=node:node . .

ENTRYPOINT ["/sbin/tini", "--"]
CMD node index.js

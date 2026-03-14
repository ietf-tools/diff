FROM node:24
LABEL maintainer="IETF Tools Team <tools-discuss@ietf.org>"

ENV NODE_ENV=production

RUN mkdir -p /app && \
    chown node:node /app
WORKDIR /app

COPY backend backend/
COPY dist dist/
COPY package.json ./
COPY package-lock.json ./

RUN npm ci --omit=dev

USER node:node
CMD ["node", "backend"]
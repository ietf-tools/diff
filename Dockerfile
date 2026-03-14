FROM node:24
LABEL maintainer="IETF Tools Team <tools-discuss@ietf.org>"

RUN mkdir -p /app && \
    chown node:node /app
WORKDIR /app

COPY backend backend/
COPY dist dist/
COPY node_modules node_modules/
COPY package.json ./
COPY package-lock.json ./

USER node:node
CMD ["node", "backend"]
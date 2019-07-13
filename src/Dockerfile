FROM mhart/alpine-node:10 as build-stage

WORKDIR /app

COPY package*.json ./
RUN npm install

EXPOSE 3000
#USER node
CMD ["npx", "pm2", "start", "ecosystem.config.js", "--no-daemon"]

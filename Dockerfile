FROM node:argon

RUN mkdir -p /opt

WORKDIR /opt

COPY package.json /opt

ENV NODE_ENV=production

RUN npm install --production

# Bundle app source
COPY . /opt

EXPOSE 8001

CMD [ "npm", "start" ]

FROM alpine

RUN apk add --update nodejs

RUN mkdir -p /opt

WORKDIR /opt

COPY package.json /opt/package.json

ENV NODE_ENV=production

RUN npm install --production

# Bundle app source
COPY . /opt

EXPOSE 8001

CMD [ "npm", "start" ]

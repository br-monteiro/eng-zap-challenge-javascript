FROM node:10-alpine

WORKDIR /opt/app

COPY . /opt/app

RUN npm install

CMD "npm start"

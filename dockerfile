FROM node:latest

WORKDIR /app/src
ADD . /app/src/

RUN npm install --force
ENTRYPOINT ["npm", "start"]
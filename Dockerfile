# To build and run with Docker:
#
#  $ docker build -t bxbot-ui .
#  $ docker run -it --rm -p 3000:3000 -p 3001:3001 bxbot-ui
#
FROM node:latest

RUN mkdir -p /bxbot-ui /home/nodejs && \
    groupadd -r nodejs && \
    useradd -r -g nodejs -d /home/nodejs -s /sbin/nologin nodejs && \
    chown -R nodejs:nodejs /home/nodejs

WORKDIR /bxbot-ui
COPY package.json typings.json /bxbot-ui/
RUN npm install --unsafe-perm=true

COPY . /bxbot-ui
RUN chown -R nodejs:nodejs /bxbot-ui
USER nodejs

CMD npm start
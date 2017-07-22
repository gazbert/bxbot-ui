FROM node:latest

RUN mkdir -p /bxbot-ui /home/nodejs && \
    groupadd -r nodejs && \
    useradd -r -g nodejs -d /home/nodejs -s /sbin/nologin nodejs && \
    chown -R nodejs:nodejs /home/nodejs

WORKDIR /bxbot-ui
COPY package.json /bxbot-ui/
RUN npm install --unsafe-perm=true

COPY . /bxbot-ui
RUN chown -R nodejs:nodejs /bxbot-ui
USER nodejs

CMD npm start
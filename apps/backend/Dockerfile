FROM node:lts-stretch
ARG LOCAL_USER_ID

RUN apt-get update -y && apt-get upgrade -y && apt-get install -y --fix-missing build-essential gcc g++ ca-certificates curl dos2unix ffmpeg sox libsox-fmt-mp3 mp3info libasound2-dev

RUN cd /opt
RUN curl -L http://archive.debian.org/debian/pool/main/m/mp3gain/mp3gain_1.5.2-r2-2+deb7u1_amd64.deb > mp3gain.deb
RUN dpkg -i mp3gain.deb

COPY ./apps/backend/docker/prod /var/docker

RUN mkdir -p /app
COPY angular.json nx.json package.json pm2.json tsconfig.json /app/
COPY ./apps/backend /app/apps/backend
COPY ./libs/backend /app/libs/backend
COPY ./builders /app/builders
COPY ./libs/shared /app/libs/shared

WORKDIR /app
RUN npm install
RUN npm install -g pm2 typescript @angular/cli
RUN pm2 install pm2-server-monit
RUN pm2 install pm2-redis
RUN pm2 set pm2-redis:ip redis

EXPOSE 8888

CMD ["sh", "/var/docker/start.sh"]

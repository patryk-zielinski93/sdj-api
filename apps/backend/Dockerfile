FROM node:lts-stretch as build
ARG LOCAL_USER_ID

WORKDIR /app

COPY angular.json nx.json package.json package-lock.json tsconfig.json ./
COPY ./apps/backend ./apps/backend
COPY ./libs/backend ./libs/backend
COPY ./libs/shared ./libs/shared

WORKDIR /app
RUN npm set progress=false && npm ci
RUN npm run ng build backend

# @ToDo use slim verion (need to install pyhon manually for youtube-dl)
FROM node:lts-stretch

RUN apt update -y && apt install -y curl mp3info ffmpeg sox libsox-fmt-mp3
RUN cd /opt
RUN curl -L http://archive.debian.org/debian/pool/main/m/mp3gain/mp3gain_1.5.2-r2-2+deb7u1_amd64.deb > mp3gain.deb
RUN dpkg -i mp3gain.deb

WORKDIR /app

COPY package.json package-lock.json apps/backend/pm2.json ./
COPY --from=build /app/dist/apps/backend ./

RUN npm set progress=false && npm ci --prod
RUN npm run pm2 install pm2-server-monit
RUN npm run pm2 install pm2-redis
RUN npm run pm2 set pm2-redis:ip redis

EXPOSE 8888

CMD npm run pm2 start pm2.json -- --no-daemon

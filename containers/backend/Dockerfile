FROM node:lts-jessie
ARG LOCAL_USER_ID

RUN echo "deb http://ftp.fr.debian.org/debian jessie-backports main" >> /etc/apt/sources.list
RUN apt-get update -y && apt-get upgrade -y && apt-get install -y --fix-missing build-essential gcc g++ ca-certificates curl dos2unix ffmpeg sox libsox-fmt-mp3 mp3info alsa-base alsa-utils libasound2-dev

RUN cd /opt
RUN curl -L http://ftp.pl.debian.org/debian/pool/main/m/mp3gain/mp3gain_1.5.2-r2-2+deb7u1_amd64.deb > mp3gain.deb
RUN dpkg -i mp3gain.deb

RUN mkdir -p /app
COPY ./ /app

WORKDIR /app
RUN npm install

EXPOSE 8888

CMD ["npm", "start"]

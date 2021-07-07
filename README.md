# SLACK DJ

[![SDJ BASE CI](https://github.com/Sikora00/sdj-api/workflows/SDJ%20BASE%20CI/badge.svg)](https://github.com/Sikora00/sdj-api/workflows/SDJ%20BASE%20CI/badge.svg)
[![Coverage Status](https://coveralls.io/repos/github/Sikora00/sdj-api/badge.svg)](https://coveralls.io/github/Sikora00/sdj-api)
[![GitHub issues](https://img.shields.io/github/issues/Sikora00/sdj-api)](https://img.shields.io/github/issues/Sikora00/sdj-api)
[![Average time to resolve an issue](http://isitmaintained.com/badge/resolution/Sikora00/sdj-api.svg)](http://isitmaintained.com/project/Sikora00/sdj-api)

## Setting up

- Create your own [youtube api key](https://developers.google.com/youtube/v3/getting-started)
- Create [slack bot](https://api.slack.com/apps)
- Copy without sample and check the configuration:
  - ./env-sample
  - ./containers/icecast/icecast-sample.xml
  - ./containers/ices/ices-sample.conf
- run npm install
- add virtual hosts from .env to your configuration

## Run production

- Run host api for spawning ices containers
  `ng build host-api && node dist/host-api/main.js`
- Run `CURRENT_UID=$(id -u):$(id -g) docker-compose up`

## Run Development

- Run host api for spawning ices containers `ng serve host-api`
- Copy ./docker-compose.override.yml-sample
- Run `CURRENT_UID=$(id -u):$(id -g) docker-compose up`

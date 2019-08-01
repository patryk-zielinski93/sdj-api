# SLACK DJ

## Setting up

- Create your own [youtube api key](https://developers.google.com/youtube/v3/getting-started)
- Create [slack bot](https://api.slack.com/apps)
- Copy without sample and check the configuration:
  - ./env-sample
  - ./ormconfig-sample.json
  - ./containers/icecast/icecast-sample.xml
  - ./containers/ices/ices-sample.conf
- run npm install
- add virtual hosts from .env to your configuration


## Run production
- Run host api for spawning ices containers
`ng build host-api && node dist/host-api/main.js`
- Run `docker-compose up`


## Run Development
- Run host api for spawning ices containers `ng serve host-api`
- Copy  ./docker-compose.override.yml-sample
- Run `docker-compose up`

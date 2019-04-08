# sdj-api
#####1. Copy: 
 * ./docker-compose.override.yml-sample
 * ./env-sample 
 * ./containers/backend/ormconfig-sample.json
 * ,/containers/icecast/icecast-sample.xml
 * ,/containers/ices/ices-sample.conf
 * ./src/configs/*.sample.ts
#####2. Create your own [youtube api key](https://developers.google.com/youtube/v3/getting-started)
#####3. Create [slack token](https://api.slack.com/custom-integrations/legacy-tokens)
#####4. Put it to ./src/connection.config.ts
#####6. Run docker api 
 * go to ./api
 * run npm install
 * run npm start
#####5. Run `docker-compose up`

``` kill -s SIGUSR1 1 - next song```

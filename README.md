# sdj-api
#####1. Copy: 
 * ./ormconfig-sample.json
 * ./env-sample 
 * ,/containers/icecast/icecast-sample.xml
 * ,/containers/ices/ices-sample.conf
 * ./src/connection.config.sample.ts
#####2. Create your own [youtube api key](https://developers.google.com/youtube/v3/getting-started)
#####3. Create [slack token](https://api.slack.com/custom-integrations/legacy-tokens)
#####4. Put it to ./src/connection.config.ts
#####5. Run `docker-compose up`

``` kill -s SIGUSR1 1 - next song```
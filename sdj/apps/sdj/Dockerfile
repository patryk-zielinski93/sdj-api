FROM node:lts-jessie as build-stage
WORKDIR /app
#ToDo To improve
COPY package.json package-lock.json /app/
RUN npm set progress=false && npm install

COPY tsconfig.json .
COPY angular.json .

COPY src /app/src
COPY src/env.sample.js /app/src/env.js

RUN npm run build

FROM nginx:1.15

COPY docker/prod/nginx/nginx.conf /etc/nginx/nginx.conf
COPY docker/prod/nginx/sdj.conf /etc/nginx/conf.d/sdj.conf
COPY docker/prod/entrypoint.sh /usr/local/bin/

RUN rm -rf /usr/share/nginx/html/* && rm /etc/nginx/conf.d/default.conf

COPY --from=build-stage /app/dist/ /usr/share/nginx/html

ENTRYPOINT ["entrypoint.sh"]

STOPSIGNAL SIGTERM

CMD ["nginx", "-g", "daemon off;"]

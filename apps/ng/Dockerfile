FROM node:lts-jessie as build-stage
WORKDIR /app

COPY . .
COPY ./apps/ng/src/env.sample.js ./apps/ng/src/env.js
RUN npm install -g @angular/cli
RUN npm set progress=false && npm install
RUN ng build ng

FROM nginx:1.15

COPY apps/ng/docker/prod/nginx/nginx.conf /etc/nginx/nginx.conf
COPY apps/ng/docker/prod/nginx/sdj.conf /etc/nginx/conf.d/sdj.conf
COPY apps/ng/docker/prod/entrypoint.sh /usr/local/bin/

RUN rm -rf /usr/share/nginx/html/* && rm /etc/nginx/conf.d/default.conf

COPY --from=build-stage /app/dist/apps/ng /usr/share/nginx/html

ENTRYPOINT ["entrypoint.sh"]

STOPSIGNAL SIGTERM

CMD ["nginx", "-g", "daemon off;"]

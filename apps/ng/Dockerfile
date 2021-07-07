FROM node:lts-jessie as build-stage
WORKDIR /app

COPY angular.json nx.json package.json package-lock.json tsconfig.base.json decorate-angular-cli.js /app/
COPY ./apps/ng/src/env.sample.js ./apps/ng/src/env.js
COPY ./apps/ng /app/apps/ng
COPY ./libs/shared /app/libs/shared
COPY ./libs/ng /app/libs/ng
RUN npm set progress=false && npm ci --unsafe-perm
RUN npm run ng build ng -- --prod

FROM nginx:1.15

COPY apps/ng/docker/prod/nginx/nginx.conf /etc/nginx/nginx.conf
COPY apps/ng/docker/prod/nginx/sdj.conf /etc/nginx/conf.d/sdj.conf
COPY apps/ng/docker/prod/entrypoint.sh /usr/local/bin/

RUN rm -rf /usr/share/nginx/html/* && rm /etc/nginx/conf.d/default.conf

COPY --from=build-stage /app/dist/apps/ng /usr/share/nginx/html

ENTRYPOINT ["entrypoint.sh"]

STOPSIGNAL SIGTERM

CMD ["nginx", "-g", "daemon off;"]

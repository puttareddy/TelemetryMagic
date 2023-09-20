# building the app using npm
FROM node:14-alpine3.13 as build

COPY . .

RUN npm install
RUN npm i node-sass

RUN npm run build


# creating the nginx image
FROM nginx:stable-alpine as release

COPY --from=build ./build /usr/share/nginx/html

COPY ./ngnix/default.conf /etc/nginx/conf.d

USER root

RUN chgrp -R root /var/cache/nginx /var/run /var/log/nginx && \
    chmod -R 770 /var/cache/nginx /var/run /var/log/nginx

EXPOSE 3000
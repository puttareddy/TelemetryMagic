FROM node:16.14.0-alpine as debug

WORKDIR /work/

COPY ./src/package.json /work/package.json
COPY ./src/package-lock.json /work/package-lock.json
COPY ./src/ /work/src/

RUN npm install
RUN npm install -g nodemon

EXPOSE 4000

# ENTRYPOINT [ "nodemon","--inspect=0.0.0.0","./src/server.js" ]
ENTRYPOINT [ "nodemon", "--experimental-specifier-resolution=node","./src/server-apollo.js"]


# FROM node:12.4.0-alpine as prod

# WORKDIR /work/
# COPY ./src/package.json /work/package.json
# RUN npm install
# COPY ./src/ /work/

# CMD node .
FROM node:18.14-alpine as builder
WORKDIR /dist
ADD . . 
RUN yarn
RUN yarn build
CMD [ "yarn", "start" ]
FROM node:16 as build-stage

WORKDIR /app

COPY package*.json /app/
RUN npm install

COPY ./ /app/
ARG REACT_APP_BACKEND_URL
RUN echo "REACT_APP_BACKEND_URL=${REACT_APP_BACKEND_URL}" > .env

RUN npm run build

FROM nginx:1.15

COPY --from=build-stage /app/build/ /usr/share/nginx/html
COPY --from=build-stage /app/.env /usr/share/nginx/html/.env
COPY nginx.conf /etc/nginx/conf.d/default.conf

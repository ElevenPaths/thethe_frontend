# Compilación
FROM node:alpine as build-stage
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Producción
FROM nginx:1.17.4-alpine as production-stage

RUN apk update

RUN rm /etc/nginx/conf.d/default.conf
COPY ./default.conf /etc/nginx/conf.d

COPY --from=build-stage /app/dist /usr/share/nginx/html

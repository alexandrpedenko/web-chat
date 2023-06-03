# Stage 1: build
FROM node:18.16.0  as development

WORKDIR /oleksandr/frontend/src/app

COPY package*.json ./

RUN npm install
RUN npm install -g @angular/cli@16.0.2

COPY . .

RUN npm run build

EXPOSE 4200

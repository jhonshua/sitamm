FROM node:19 as build
WORKDIR /app
COPY dist /app/build
RUN npm install -g serve
CMD serve -s build -l 5000

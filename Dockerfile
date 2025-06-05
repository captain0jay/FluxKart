FROM node:18.17.0

WORKDIR /app

COPY package*.json ./

RUN npm cache clean --force && \
    rm -rf node_modules && \
    npm install

COPY . .

EXPOSE 3000

CMD ["npm", "run", "start"]
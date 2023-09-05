FROM  node:18.17.0

WORKDIR /front-end/simt/

# o "./" se refere ao diretorio workdir
COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "start"]
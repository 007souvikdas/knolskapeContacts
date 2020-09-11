#Node LTS version
FROM node:10

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./

RUN npm build

RUN npm install

# RUN npm install -g nodemon

# Bundle app source
COPY . .

EXPOSE 8811

#run the app
CMD [ "npm", "run", "stage" ]
# Step 1: Use Node image to build the project
FROM node:18 AS build

WORKDIR /app
COPY package.json package-lock.json ./

RUN npm install
COPY . ./

RUN npm run build

# Step 2: Run the server
FROM node:18

WORKDIR /app
COPY --from=build /app/dist /app/dist

COPY package.json package-lock.json ./
RUN npm install --production

EXPOSE 5000
CMD ["node", "dist/server.js"]

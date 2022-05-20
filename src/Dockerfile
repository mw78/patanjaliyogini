# https://github.com/BretFisher/node-docker-good-defaults/blob/69c923bc646bc96003e9ada55d1ec5ca943a1b19/Dockerfile
FROM node:16-slim
COPY --chown=node:node ./ ./
RUN npm install --no-optional && npm cache clean --force
RUN npx tsc index.ts
CMD ["node", "index.js"]

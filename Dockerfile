FROM onfinality/subql-node:v1.18.0
WORKDIR /app
COPY . .
RUN  yarn && yarn codegen && yarn build

# TODO: remove depedences

Entrypoint  ["/sbin/tini","--","/usr/local/lib/node_modules/@subql/node/bin/run"]
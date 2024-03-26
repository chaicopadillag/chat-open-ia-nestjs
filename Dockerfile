FROM node:lts-alpine3.19 as dev
ENV APP=/app
WORKDIR ${APP}
COPY package.json ${APP}
RUN yarn --ignore-engines
CMD [ "yarn","dev" ]

FROM node:lts-alpine3.19 as depens
ENV APP=/app
WORKDIR ${APP}
COPY package.json ${APP}
RUN yarn --ignore-engines

FROM node:lts-alpine3.19 as builder
ENV APP=/app
WORKDIR ${APP}
COPY --from=depens ${APP}/node_modules ${APP}/node_modules
COPY . ${APP}
RUN yarn build

FROM node:lts-alpine3.19 as prod
EXPOSE ${PORT}
ENV APP=/app
WORKDIR ${APP}
COPY package.json ${APP}
COPY --from=builder ${APP}/dist ${APP}/src
COPY generated ${APP}/generated
RUN yarn --prod --ignore-engines
CMD [ "node","src/main" ]



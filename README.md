
## Description

[Nest](https://github.com/nestjs/nest) Nest monoRepo customizable interService communication
## Project setup

```bash
$ yarn install
```

## Compile and run the project

```bash
# development
$ yarn run start

# watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod

# run both apps
$ start:all
```

## Run tests

```bash
# unit tests
$ yarn run test

# e2e tests
$ yarn run test:e2e

# test coverage
$ yarn run test:cov

# run all test
$ yarn test:watch
```


## Docs
Task Manager application is an event-driven microservice system built on NestJS and orchestrated with Docker Compose.

Key Architectural Summary:
Services: task-service (for CRUD operations) and scheduler-service (for time-based events) are the core business logic components.

Message Broker: Kafka is used as the central communication backbone, with Zookeeper for coordination.

Networking: All services reside on the internal Docker network, kafka-net.

Configuration Structure:
The application uses a distributed configuration approach across multiple .env files:

Root .env (Shared): Contains common credentials and networking settings, most importantly KAFKA_BROKERS=kafka:9093 (using the internal Docker service name).

Service .env files: (apps/task-service/.env, apps/scheduler-service/.env) define service-specific ports and database names.

Prisma .env files: Hold specific DATABASE_URL connections for infrastructure setup.

Shared Socket: (libs/shared-socket) holds configuration like the WS_server address.

you can find env template in each app like this : 
appName/src/infrastructure/prisma



## Inter Communication
we support two option for service interCommunication configurable using env var consist of kafka nad ws


## DB ORM
we support two option for db ORM configurable using env var consist of prisma or typeorm

## Attention
Do not forget that this docker-compose file doesn't provide postgres DB for you you have to setup manually and gracefully provide the connection urls for the application
"use strict";

// NPM Dependencies
import * as config from "config";
import * as skeleton from "swagger-service-skeleton";
import * as somersault from "somersault";
import * as winston from "winston";
import customServiceContract from "./contract/contract";
import bodyParser from "./bodyParser";

import { createConnection } from "typeorm";
import Address from "./models/Address";
import Category from "./models/Category";
import LogMessage from "./models/LogMessage";
import Order from "./models/Order";
import Pet from "./models/Pet";
import Tag from "./models/Tag";
import User from "./models/User";

const container = somersault.createContainer();

const log = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  defaultMeta: { service: "user-service" },
  transports: [
    //
    // - Write all logs with level `error` and below to `error.log`
    // - Write all logs with level `info` and below to `combined.log`
    //
    new winston.transports.File({ filename: "error.log", level: "error" }),
    new winston.transports.File({ filename: "combined.log" }),
  ],
});
//
// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
//
if (process.env.NODE_ENV !== "production") {
  log.add(new winston.transports.Console({
    format: winston.format.simple(),
  }));
}

const TypeORM_TYPE = config.get("DatabaseTypeORM.Type");
const TypeORM_HOST = config.get("DatabaseTypeORM.Host");
const TypeORM_PORT = config.get("DatabaseTypeORM.Port");
const TypeORM_UserName = config.get("DatabaseTypeORM.UserName");
const TypeORM_Password = config.get("DatabaseTypeORM.Password");
const TypeORM_DatabaseName = config.get("DatabaseTypeORM.DatabaseName");

if (process.env.NODE_ENV !== "production") {
  log.debug(`TypeORM_TYPE: ${TypeORM_TYPE}`);
  log.debug(`TypeORM_HOST: ${TypeORM_HOST}`);
  log.debug(`TypeORM_PORT: ${TypeORM_PORT}`);
  log.debug(`TypeORM_UserName: ${TypeORM_UserName}`);
  log.debug(`TypeORM_Password: ${TypeORM_Password}`);
  log.debug(`TypeORM_DatabaseName: ${TypeORM_DatabaseName}`);
}


createConnection({
  type: TypeORM_TYPE,
  host: TypeORM_HOST,
  port: TypeORM_PORT,
  username: TypeORM_UserName,
  password: TypeORM_Password,
  database: TypeORM_DatabaseName,
  entities: [
    Address,
    Category,
    LogMessage,
    Order,
    Pet,
    Tag,
    User,
  ],
  synchronize: false,
  logging: true
}).then(connection => {
  // here you can start to work with your entities
}).catch(error => {
  log.error(`TypeORM connection error, exit service! Error: ${error}`);
  log.error(`TypeORM_TYPE: ${TypeORM_TYPE}`);
  log.error(`TypeORM_HOST: ${TypeORM_HOST}`);
  log.error(`TypeORM_PORT: ${TypeORM_PORT}`);
  if (process.env.NODE_ENV !== "production") {
    log.error(`TypeORM_UserName: ${TypeORM_UserName}`);
    log.error(`TypeORM_Password: ${TypeORM_Password}`);
  }
  log.error(`TypeORM_DatabaseName: ${TypeORM_DatabaseName}`);
  process.exit(1);
});

// mongodb.connection.on("disconnected", () => {
//   log.error("Disconnected from MongoDB, exit service!");
//   process.exit(2);
// });

// Mixin the elements we can"t store as static config values.
const generateInstance = () => skeleton({
  codegen: {
    templateSettings: {
      implementationPath: "../../src/controllers",
    },
    temporaryDirectory: "./dist/.temp",
    oas_controllerFolder: "./controllers",    // Relative to the temporaryDirectory
  },
  cors: {
    credentials: true,
    methods: "GET,POST,PUT,DELETE",
    origin: (origin, callback) => callback(null, origin),
  },
  customMiddleware: {
    afterSwagger: [],
    beforeController: [],
    beforeSwagger: [
      bodyParser(),
    ],
  },
  ioc: {
    autoRegister: {
      pattern: "./services/*.js",
      rootDirectory: __dirname,
    },
    rootContainer: container,
  },
  redirects: {
    "documentation-from-root": { match: /^\disabled$/ },
  },
  service: {
    listenPort: config.get("api.listenPort"),
    // swagger: serviceContract,
    swagger: customServiceContract,
  },
});

function bootstrap() {
  // container.register("dealerService", new DealerService());
  log.info("TEST 2 Model Data Service up");
  return Promise.resolve();
}

module.exports = { bootstrap: bootstrap(), container, generateInstance };

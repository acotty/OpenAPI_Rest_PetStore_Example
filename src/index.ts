"use strict";

// NPM Dependencies
import bodyParser from "./bodyParser";
import * as config from "config";
import * as cookieParser from "cookie-parser";
import * as skeleton from "openapi-service-skeleton";
import * as somersault from "somersault";
import * as winston from "winston";
import { createConnection } from "typeorm";
import * as stringify from "json-stringify-safe";

import customServiceContract from "./contract/contract";
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
//  console.log(connection);
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

// Middleware to run after some essentials/setup
// but before the exegesis-express routes.
function beforeOpenAPITest() {
  return (req, res, next) => {
      console.log(`Called beforeOpenAPITest()`);
      //console.log(`req : ${stringify(req, null, 4)}\n`);
      next();
  };
}

// Middleware to run after exegesis-express routes, if the
// request does not get handled by exegesis-express (i.e.
// custom error handling)
function afterOpenAPITest() {
  return (err, req, res, next) => {
      console.log(`Called afterOpenAPITest()`);
      console.log(`err : ${stringify(err, null, 4)}\n`);
      //console.log(`req : ${stringify(req, null, 4)}\n`);
      next();
  };
}

// Middleware to run if the request has not been processed, so return 404
function errorReqestNotProcessed404() {
  return (req, res) => {
      // Return a 404
        res.status(404).json({message: `Not found`});
  };
}

const enableKeycloakAuthorization = config.get("api.enableKeycloakAuthorization");

let exegesisAuthenticator = {};
if ( enableKeycloakAuthorization ) {
  exegesisAuthenticator = {
    // Both not used in OpenAPI, but can be enabled for testing...
    // sessionKey: sessionAuthenticator,
    // addBasicAuth() {
    //   return [];
    // },
    petstoreAuthorise() {   // Thsi matches the securitySchemes in the OpenAPI yaml file
      return { type: "success", user: "benbria", scopes: ["readOnly"] };
    },
  };
  log.info("Keycloak Authentication is Enabled");
} else {
  log.info("Keycloak Authentication is Disabled");
  exegesisAuthenticator = {
    // Both not used in OpenAPI, but can be enabled for testing...
    // sessionKey: sessionAuthenticator,
    // addBasicAuth() {
    //   return [];
    // },
    petstoreAuthorise() {   // Thsi matches the securitySchemes in the OpenAPI yaml file
      return { type: "success", user: "all", scopes: ["*"] };
    },
  };
}

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
    beforeOpenAPI: [
      beforeOpenAPITest(),
      cookieParser(),   // for a Keycloak token
      bodyParser(),
    ],
    // afterOpenAPI: [
    //   afterOpenAPITest()
    // ],
    // errorProcessingNoRoute: [
    //   errorReqestNotProcessed404()
    // ],
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
    // openapi: serviceContract,
    openapi: customServiceContract,
  },
  exegesisOptions: {
    authenticators: exegesisAuthenticator,
  }
});

function bootstrap() {
  // container.register("dealerService", new DealerService());
  log.info("Petstore RestAPI Service up");
  return Promise.resolve();
}

module.exports = {
  bootstrap: bootstrap(),
  container,
  generateInstance
};

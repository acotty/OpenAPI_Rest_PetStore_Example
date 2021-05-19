# OpenAPI RestAPI PetStore Example

[![Prod Dependencies](https://david-dm.org/acotty/OpenAPI_Rest_PetStore_Example/status.svg)](https://david-dm.org/acotty/OpenAPI_Rest_PetStore_Example)

[![Dev Dependencies](https://david-dm.org/acotty/OpenAPI_Rest_PetStore_Example/dev-status.svg)](https://david-dm.org/acotty/OpenAPI_Rest_PetStore_Example#info=devDependencies)

[![Build](https://github.com/acotty/OpenAPI_Rest_PetStore_Example/actions/workflows/node.js.yml/badge.svg)](https://github.com/acotty/OpenAPI_Rest_PetStore_Example/actions/workflows/node.js.yml)

[![Build Matrix](http://github-actions.40ants.com/acotty/OpenAPI_Rest_PetStore_Example/matrix.svg)](https://github.com/acotty/OpenAPI_Rest_PetStore_Example)

OpenAPI 3.0 restAPI petstore data service example.

## Windows /MAC Start

### Pre-requirements

* Docker Descktop CE 3.0.0+
* Docker Compose v1.28.5+
* Node v12.0.0+
* Yarn v1.22.4+ (not yarn 2.x series)
* NPN v7.12.0+

### Setup

TBA

### To launch the environment

```make
make up
```

The MySQL databse is configured by the docker vomule mapping './MYSQL_DB_Setup/DockerSartupScripts:/docker-entrypoint-initdb.d', which when the docker container is created runs the *.sql scripts in the mapped directory './MYSQL_DB_Setup/DockerSartupScripts'. More details can be found on the <https://hub.docker.com/_/mysql/> web page.

### Install node moodule dependencies

```yarn
yarn install
```

### Launch Data Service

```yarn
yarn install
yarn start
```

### To access the service OpenAPI Rest API UI

[http://localhost:10010/API_docs/](http://localhost:10010/API_docs/)

### To tear down docker environment

This will delete the containers and images:

```make
make down
```

This command will stop the running containers:

```make
make stop
```

#### Tips

Don't use *.localhost domain, chrome doesn't support sub-domain cookies on localhost

## Unit Tests

To run the data service unit tests use the following commands:

* yarn test  - this is an alais for yarn run server-test
* yarn server-test - this does a build and runs the tests
* yarn testServer - this runs the tests

### Code Coverage

Part of the unit tests produces a set of code coverage reports that are in the coverage directory. To view the report on the following  file:

```NYC
coverage./index.html
```

## DEBUG RESTAPI SERVICE

### Via Visual Studio Code configuration and run

1. If you are using Visual Studio Code editor ensure you have the following files:

   ```vscode
      * vscode\launch.json
      * vscode\tasks.json
   ```  

2. In Visual Studio Code select the debugger on the left and then above the debug side bar select the launch option you want and press the start debugging button. For more details have a look a the following URL:

      [https://code.visualstudio.com/docs/editor/debugging](https://code.visualstudio.com/docs/editor/debugging)

   If you select the "Debug data Service"" option you can then set breakpoints in teh typescript files and debug the edge service like a normal nodejs application.

### Via Visual Studio Code Terminal

1. Start a **"Javascript Debug Terminal"**
2. Set breakpoints.
3. Run app via **yarn start**.
4. Debug running app.


## REST API RESPONSE CODES

For more details on the rest api response codes see <https://restfulapi.net/http-status-codes> and/or <https://www.restapitutorial.com/httpstatuscodes.html>

These are the standard restAPI response codes:

```Codes
    400 Bad Request – client sent an invalid request, such as lacking required request body or parameter
    401 Unauthorized – client failed to authenticate with the server
    403 Forbidden – client authenticated but does not have permission to access the requested resource
    404 Not Found – the requested resource does not exist
    412 Precondition Failed – one or more conditions in the request header fields evaluated to false
    
    500 Internal Server Error – a generic error occurred on the server
    501 Not Implemented - The HTTP method is not supported by the server and cannot be handled.
    503 Service Unavailable – the requested service is not available
```

## Notes

* Docker compose use container-names to make service resolution easier.  The side effect is you can't use compose scaling options
* Controller file name must be lowercase!!!

## Trouble Shooting

* 'There were no instances available for the specified service.' - try to restart 'make restart` then wait to try again
* docker hyperkit CPU too high - wait (open to better suggestions)

## See Also

The following github projects are useful reading:

* <https://github.com/acotty/opeanapi-service-skeleton-tutorial>
  * Tutorial on how to use this package.
* [https://github.com/acotty/opeanapi-service-skeleton](https://github.com/acotty/opeanapi-service-skeleton)
  * Code used to spin up the service code under the hood.

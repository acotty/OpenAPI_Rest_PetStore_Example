# rest-service-example
Rest data service example.

# Windows /MAC Start

## Pre-requirements
* Docker Desckyop CE v20.10.5+
* Docker Compose v1.28.5+
* Node v15.11.0 or later
* Yarn v1.22.4 (not yarn 2.x series) 
* NPN v7.6.3+

## Setup
Create a local .env file for docker compose with the following lines in it if it does not exist:
````
DOCKER_PREFIX=
BASEHOST=local.test.com.au
````

## Install node moodule dependencies
```
1. yarn install
```

### To launch the environment
```
1. make up
```

### To tear down
This will delete the containers and images:
```
1. make down
```

This command will stop the running containers:
```
1. make stop
```

### Launch Data Service
```
1. yarn install
2. yarn start
```

### To access the service OpenAPI Rest API UI

```
http://rest-service-test.local.test.com.au:10010/docs
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

```
covergae./index.html
```

# DEBUG DATA SERVICE

1. If you are using Visual Studio Code editor ensure you have the following files:

```
  * vscode\launch.json
  * vscode\tasks.json
```  

2. In Visual Studio Code select the debugger on the left and then above the debug side bar select the launch option you want and press the start debugging button. For more details have a look a the following URL:

```
   https://code.visualstudio.com/docs/editor/debugging
```

   If you select the "Debug data Service"" option you can then set breakpoints in teh typescript files and debug the edge service like a normal nodejs application.

# Notes

* Docker compose use container-names to make service resolution easier.  The side effect is you can't use compose scaling options
* Controller file name must be lowercase!!!

#### Trouble Shooting
* 'There were no instances available for the specified service.' - try to restart 'make restart` then wait to try again
* docker hyperkit CPU too high - wait (open to better suggestions)



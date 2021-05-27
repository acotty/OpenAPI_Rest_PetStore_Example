/* eslint-disable no-debugger */
/* eslint-disable no-console */
// process.env.debug = '*';

import * as request from "supertest";
import * as proxyquire from "proxyquire";
import * as fdequal from "fast-deep-equal";
import * as appRoot  from "app-root-path";
import * as path from "path";
import * as mockAddress from "../../MockData/mockAddress";
import * as chalk from "chalk";
import * as diff from "diff";
import { expect } from "chai";
import * as _ from "lodash";

const emptyStub   =  { };
const pathDistDirectory = path.join(appRoot.toString(), "dist/src");


function checkResResponseBody(resultJson, expectedJson) {
  if (!fdequal(resultJson, expectedJson)) {
    console.error(chalk.red(`Request body does not match expected result.`));
    console.error(chalk.yellow(`Request body : ${JSON.stringify(resultJson, null, 2)}`));
    console.error(chalk.yellowBright(`Expected data: ${JSON.stringify(expectedJson, null, 2)}`));

    console.error(chalk.red(`Differences are (green add, red removed, gray same):`));
    const differences = diff.diffJson(resultJson, expectedJson);
    differences.forEach((part) => {
      if (part.added) {
        process.stderr.write(chalk.green(part.value));
      } else if (part.removed) {
        process.stderr.write(chalk.red(part.value));
      } else {
        process.stderr.write(chalk.grey(part.value));
      }
    });
    debugger;
    throw new Error(`Request body does not match expected result.`);
  }
}

describe("Pet Controller Tests", () => {
  let instance = null;

  before(() => {
    const app = proxyquire(pathDistDirectory, { 'emptyStub': emptyStub });
    return app.generateInstance()
    .then((result) => {
      instance = result;
    })
  });

  after(() => {
    if (instance !== null) {
      instance.close();
      instance = null
    }
  });

  it("ADDRESS POST - Add a new address id#100 to the address table", () => {
    const dataJsonTest = JSON.parse(JSON.stringify(mockAddress.Address_ID_100));

    return request('http://localhost:10010')
      .post(`/Address`)
      .set('Accept', 'application/json')
      .send(dataJsonTest)
      .expect('Content-Type', 'application/json')
      .expect(200)
      .expect( (res) => {
          checkResResponseBody(res.body, dataJsonTest);
      })
      .catch((error) => {
        debugger;
        throw error;
      })
  });

  it("ADDRESS POST - Add a new address id#100 to the address table", () => {
    const dataJsonTest = JSON.parse(JSON.stringify(mockAddress.Address_ID_101));

    return request('http://localhost:10010')
      .post(`/Address`)
      .set('Accept', 'application/json')
      .send(dataJsonTest)
      .expect('Content-Type', 'application/json')
      .expect(200)
      .expect( (res) => {
          checkResResponseBody(res.body, dataJsonTest);
      })
      .catch((error) => {
        debugger;
        throw error;
      })
  });

  it("ADDRESS PUT - Add a new address id#30 and update it in the address table", () => {
    const testRequest = request('http://localhost:10010');

    const dataJsonTest = JSON.parse(JSON.stringify(mockAddress.Address_ID_101));
    dataJsonTest.id = 30;

    return testRequest
      .post(`/Address`)
      .set('Accept', 'application/json')
      .send(dataJsonTest)
      .expect('Content-Type', /json/)
      .expect(200)
      .expect( (res) => {
          checkResResponseBody(res.body, dataJsonTest);
      })
      .then(() => {
        dataJsonTest.street = "Automation Street",
        dataJsonTest.city = "DDD",
        dataJsonTest.state = "SuperTest",
        dataJsonTest.zip = "019283"

        return testRequest
          .put(`/Address`)
          .set('Accept', 'application/json')
          //.set('Content-Type', 'application/json')
          .send(dataJsonTest)
          //.expect('Content-Type', /json/)
          .expect(200)
          .expect( (res) => {
              checkResResponseBody(res.body, dataJsonTest);
          })
      })
      .catch((error) => {
        debugger;
        throw error;
      })
  });

it("Address GET - Get NO Address by ID #0 from the address", () => {
  return request('http://localhost:10010')
    .get(`/Address/0`)
    .set('Accept', 'application/json')
    .expect(200, {})
    .catch((error) => {
      debugger;
      throw error;
    })
  });


  it("Address GET - Get Address by ID #101 from the address", () => {
    const dataJsonTest = JSON.parse(JSON.stringify(mockAddress.Address_ID_101));

    return request('http://localhost:10010')
      .get(`/Address/${dataJsonTest.id}`)
      .set('Accept', 'application/json')
      .expect(200)
      .expect( (res) => {
        checkResResponseBody(res.body, dataJsonTest);
      })
      .catch((error) => {
        debugger;
        throw error;
      })
    });


  it("PET DELETE - Delete pet by ID #200 after adding it from the petstore", () => {
    const testRequest = request('http://localhost:10010');
    const dataJsonTest = JSON.parse(JSON.stringify(mockAddress.Address_ID_101));

    dataJsonTest.id = 200;

    return testRequest
      .post(`/Address`)
      .set('Accept', 'application/json')
      .send(dataJsonTest)
      .expect('Content-Type', 'application/json')
      .expect(200)
      .expect( (res) => {
          checkResResponseBody(res.body, dataJsonTest);
      })
      .then(() => {
        return testRequest
          .get(`/Address/${dataJsonTest.id}`)
          .set('Accept', 'application/json')
          .expect(200)
          .expect( (res) => {
            checkResResponseBody(res.body, dataJsonTest);
          })
      })
      .then(() => {
        return testRequest
          .delete(`/Address/${dataJsonTest.id}`)
          .set('Accept', 'application/json')
          .expect(200)
          .expect( (res) => {
            checkResResponseBody(res.body, dataJsonTest);
          })
      })
      .catch((error) => {
        debugger;
        throw error;
      })
  });

});


//  SELECT
//  	P.*,
//  	T.Name as TagName
//  FROM petstore.pets P
//  left outer JOIN petstore.pets_tags_tags I
//  	ON P.id = I.petsID
//  left outer JOIN petstore.tags T
//  	ON I.tagsID = T.id;

//  SELECT * FROM petstore.pets;
//  SELECT * FROM petstore.tags;
//  SELECT * FROM petstore.pets_tags_tags;

// /*
// drop table petstore.orders;
// drop table petstore.logMessages;
// drop table petstore.pets_tags_tags;
// drop table petstore.pets;
// drop table petstore.users;
// drop table petstore.tags;
// drop table petstore.categorys;
// drop table petstore.addresss;
// */

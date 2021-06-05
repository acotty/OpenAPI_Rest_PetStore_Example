/* eslint-disable no-debugger */
/* eslint-disable no-console */
// process.env.debug = '*';

import * as request from "supertest";
import * as proxyquire from "proxyquire";
import * as fdequal from "fast-deep-equal";
import * as appRoot  from "app-root-path";
import * as path from "path";
import * as mockUser from "../../MockData/mockUser";
import * as chalk from "chalk";
import {diff} from "jest-diff";
// import { expect } from "chai";
// import * as _ from "lodash";

const emptyStub   =  { };
const pathDistDirectory = path.join(appRoot.toString(), "dist/src");


function checkResResponseBody(resultJson, expectedJson) {
  const currentDate = new Date();
  const updatedDate = new Date(resultJson.updated_at);
  const diffSeconds = currentDate.getSeconds() - updatedDate.getSeconds();
  if (diffSeconds < 10) {
    // Keep compare below happy!!!!
    expectedJson.updated_at = resultJson.updated_at;
  }

  if (!fdequal(resultJson, expectedJson)) {
    console.error(chalk.red(`Request body does not match expected result.`));
    const jdifferences = diff(expectedJson, resultJson);
    process.stderr.write(jdifferences);

    debugger;
    throw new Error(`Request body does not match expected result.`);
  }
}

describe("User Controller Tests", () => {
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

  it("User POST - Add a new user id#100 to the user table", () => {
    const dataJsonTest = JSON.parse(JSON.stringify(mockUser.User_ID_100));

    return request('http://localhost:10010')
      .post(`/user`)
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

  it("User POST - Add a new user id#101 to the user table", () => {
    const dataJsonTest = JSON.parse(JSON.stringify(mockUser.User_ID_101));

    return request('http://localhost:10010')
      .post(`/user`)
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

  it.only("User POST - Add bulk list of users to the user table", () => {
    let dataUserArrayJsonTest = [];
    for(let i =0; i < 5; i = i+1) {
      let dataJsonTest = JSON.parse(JSON.stringify(mockUser.User_ID_100));
      dataJsonTest.id = 400 + i;
      dataJsonTest.userName = `User_${dataJsonTest.id}`;
      dataJsonTest.email = `email_${dataJsonTest.id}`;
      dataJsonTest.password = `password_${dataJsonTest.id}`;
      dataJsonTest.phone = `(00) 9999_${dataJsonTest.id}`;
      dataUserArrayJsonTest.push(dataJsonTest)
    }

    return request('http://localhost:10010')
      .post(`/user/createUserArray`)
      .set('Accept', 'application/json')
      .send(dataUserArrayJsonTest)
      .expect('Content-Type', 'application/json')
      .expect(200)
      .expect( (res) => {
          checkResResponseBody(res.body, dataUserArrayJsonTest);
      })
      .catch((error) => {
        debugger;
        throw error;
      })
  });

  it("User PUT - Add a new user id#30 and update it in the user table", () => {
    const testRequest = request('http://localhost:10010');

    const dataJsonTest = JSON.parse(JSON.stringify(mockUser.User_ID_30));

    return testRequest
      .post(`/user`)
      .set('Accept', 'application/json')
      .send(dataJsonTest)
      .expect('Content-Type', /json/)
      .expect(200)
      .expect( (res) => {
        checkResResponseBody(res.body, dataJsonTest);
      })
      .then(() => {
        dataJsonTest.email = "email_222";
        dataJsonTest.password = "password_222";
        dataJsonTest.phone = "(00) 1234-2222";
        dataJsonTest.userStatus = 3;

        return testRequest
          .put(`/user/${dataJsonTest.id}`)
          .set('Accept', 'application/json')
          .send(dataJsonTest)
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

it("User GET - Get NO User by ID #0 from the user", () => {
  return request('http://localhost:10010')
    .get(`/user/0`)
    .set('Accept', 'application/json')
    .expect(404)
    .catch((error) => {
      debugger;
      throw error;
    })
  });


  it("User GET - Get User by ID #101 from the user", () => {
    const dataJsonTest = JSON.parse(JSON.stringify(mockUser.User_ID_101));

    return request('http://localhost:10010')
      .get(`/user/${dataJsonTest.id}`)
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

  it("User GET - Get no User by non sensical userName from the user", () => {
    return request('http://localhost:10010')
      .get(`/user/name/What-Name`)
      .set('Accept', 'application/json')
      .expect(200, {})
      .catch((error) => {
        debugger;
        throw error;
      })
  });

  it("User GET - Get userName by mock #101 userName from the userstore", () => {
    const dataJsonTest = JSON.parse(JSON.stringify(mockUser.User_ID_101));

    return request('http://localhost:10010')
      .get(`/user/name/${dataJsonTest.userName}`)
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


  it("User DELETE - Delete user by ID #200 after adding it from the userstore", () => {
    const testRequest = request('http://localhost:10010');
    const dataJsonTest = JSON.parse(JSON.stringify(mockUser.User_ID_101));

    return testRequest
      .get(`/user/${dataJsonTest.id}`)
      .set('Accept', 'application/json')
      .expect( (res) => {
        return res;
      })
      .then((result) => {
        if (result.statusCode === 404) {  // UserID does not exist, so add user
          return testRequest
          .post(`/user`)
          .set('Accept', 'application/json')
          .send(dataJsonTest)
          .expect('Content-Type', 'application/json')
          .expect(200)
          .expect( (res) => {
              checkResResponseBody(res.body, dataJsonTest);
          })
        }
      })
      .then(() => {
        return testRequest
          .delete(`/user/${dataJsonTest.id}`)
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

  it("User DELETE - Delete user by userName from mock #200 after adding it from the userstore", () => {
    const testRequest = request('http://localhost:10010');
    const dataJsonTest = JSON.parse(JSON.stringify(mockUser.User_ID_101));

    dataJsonTest.id = 200;

    return testRequest
      .post(`/user`)
      .set('Accept', 'application/json')
      .send(dataJsonTest)
      .expect('Content-Type', 'application/json')
      .expect(200)
      .expect( (res) => {
          checkResResponseBody(res.body, dataJsonTest);
      })
      .then(() => {
        return testRequest
          .get(`/user/name/${dataJsonTest.userName}`)
          .set('Accept', 'application/json')
          .expect(200)
          .expect( (res) => {
            checkResResponseBody(res.body, dataJsonTest);
          })
      })
      .then(() => {
        return testRequest
          .delete(`/user/name/${dataJsonTest.userName}`)
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

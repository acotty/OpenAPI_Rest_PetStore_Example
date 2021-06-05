/* eslint-disable no-debugger */
/* eslint-disable no-console */
// process.env.debug = '*';

import * as request from "supertest";
import * as proxyquire from "proxyquire";
import * as fdequal from "fast-deep-equal";
import * as appRoot  from "app-root-path";
import * as path from "path";
import * as mockPet from "../../MockData/mockPet";
import * as chalk from "chalk";
import {diff} from "jest-diff";
import { expect } from "chai";
import * as _ from "lodash";

const emptyStub   =  { };
const pathDistDirectory = path.join(appRoot.toString(), "dist/src");

function getPurgedObj(obj) {
  const emptyArray = ['', null, [''], [null], [{}]];
  let stringfiedObj = JSON.stringify(obj, (key, value) => {
    return  (
              ['', null, [''], [null], [{}]].includes(value) ||
              (typeof value === 'object' && (value.length === 0 || Object.keys(value).length === 0)) ||
              (Array.isArray(value) && (value.length === 0 || emptyArray.includes(value[0])))
            ) ? undefined : value;
  });
  let resObj = JSON.parse(stringfiedObj);
  let isEmptyPropsPresent = ['{}', '[]', '""', 'null'].some((key) => stringfiedObj.includes(key))
  if(isEmptyPropsPresent) {
    return getPurgedObj(resObj);
  }
  return resObj;
}

function checkJsonAfterPurge(requestJson, expectedJSON) {
  const requestJsonPurged = getPurgedObj(requestJson);
  const expectedJSONPurged = getPurgedObj(expectedJSON);
  if (!fdequal(requestJsonPurged, expectedJSONPurged)) {
    console.error(chalk.red(`Request body does not match expected result.`));
    const jdifferences = diff(expectedJSONPurged, requestJsonPurged);
    process.stderr.write(jdifferences);

    debugger;
    throw new Error(`Request body does not match expected result.`);
  }
}

function getPetsAfterTagIDCheck(resultJson, expectedJson) {
  if ((!Object.prototype.hasOwnProperty.call(resultJson, 'tags')) || (!Object.prototype.hasOwnProperty.call(expectedJson, 'tags'))) {
    if (Object.prototype.hasOwnProperty.call(resultJson, 'tags')) {
      delete resultJson['tags'];
    }
    if (Object.prototype.hasOwnProperty.call(expectedJson, 'tags')) {
      delete expectedJson['tags'];
    }
    return;
  }

  if ( (Object.prototype.hasOwnProperty.call(resultJson, 'tags')) && (Object.prototype.hasOwnProperty.call(expectedJson, 'tags'))) {
    if (resultJson.tags.length === 0) {
      delete resultJson['tags'];
    } else {
      for (let index = 0; index < resultJson.tags.length; index += 1) {
        if (Object.prototype.hasOwnProperty.call(resultJson.tags[index], 'id')) {
          delete resultJson.tags[index]['id'];
        }
      }
    }

    if (expectedJson.tags.length === 0) {
      delete resultJson['tags'];
    } else {
      for (let index = 0; index < expectedJson.tags.length; index += 1) {
        if (Object.prototype.hasOwnProperty.call(expectedJson.tags[index], 'id')) {
          delete expectedJson.tags[index]['id'];
        }
      }
    }
    return;
  }

  if (
    (
      (
        ! Object.prototype.hasOwnProperty.call(resultJson, 'tags')
        ||
        resultJson.tags === null
        ||
        resultJson.tags === [{}]
      )
      ||
      (
        Object.prototype.hasOwnProperty.call(resultJson, 'tags')
        &&
        !Object.prototype.hasOwnProperty.call(resultJson.tags[0], 'id')
      )
    )
    &&
    Object.prototype.hasOwnProperty.call(expectedJson, 'tags')
  ) {
    if (Object.prototype.hasOwnProperty.call(resultJson, 'tags')) {
      delete resultJson['tags'];
    }
    if (Object.prototype.hasOwnProperty.call(expectedJson, 'tags')) {
      delete expectedJson['tags'];
    }
  }
}

function checkResResponseBodyAfterPurge(resultStatus, expectedStatus, resultJsonParm, expectedJsonParm) {
  let resultJson = _.cloneDeep(resultJsonParm);
  let expectedJson = _.cloneDeep(expectedJsonParm);
  if (resultStatus != expectedStatus) {
    debugger;
    console.error(chalk.red(`resultJson: ${JSON.stringify(resultJson, null, 2)}`));
    expect(resultStatus).to.equal(expectedStatus);
  } else {
    getPetsAfterTagIDCheck(expectedJson, resultJson);
    checkJsonAfterPurge(expectedJson, resultJson);
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

  it("PET POST - Add a new pet id#10 to the petstore", () => {
    const petJsonTest = JSON.parse(JSON.stringify(mockPet.PET_ID_10));

    return request('http://localhost:10010')
      .post(`/pet`)
      .set('Accept', 'application/json')
      .send(petJsonTest)
      .expect('Content-Type', 'application/json')
      .expect( (res) => {
        checkResResponseBodyAfterPurge(res.status, 200, res.body, petJsonTest);
      })
      .catch((error) => {
        debugger;
        throw error;
      })
  });

  it("PET POST - Add a new pet id#11 to the petstore", () => {
    const petJsonTest = JSON.parse(JSON.stringify(mockPet.PET_ID_11));

    return request('http://localhost:10010')
      .post(`/pet`)
      .set('Accept', 'application/json')
      .send(petJsonTest)
      .expect('Content-Type', 'application/json')
      .expect( (res) => {
        checkResResponseBodyAfterPurge(res.status, 200, res.body, petJsonTest);
      })
      .catch((error) => {
        debugger;
        throw error;
      })
  });

  it("PET PUT - Add and update new pet id#12 to the petstore", () => {
    const testRequest = request('http://localhost:10010');
    const petJsonTest = JSON.parse(JSON.stringify(mockPet.PET_ID_11));
    petJsonTest.id = 12;
    petJsonTest.name = 'doggie_12';

    return testRequest
      .post(`/pet`)
      .set('Accept', 'application/json')
      .send(petJsonTest)
      .expect('Content-Type', 'application/json')
      .expect( (res) => {
        checkResResponseBodyAfterPurge(res.status, 200, res.body, petJsonTest);
      })
      .then(() => {
        petJsonTest.name = 'doggie_12Update';
        return testRequest
          .put(`/pet`)
          .set('Accept', 'application/json')
          .send(petJsonTest)
          .expect('Content-Type', 'application/json')
          .expect( (res) => {
            checkResResponseBodyAfterPurge(res.status, 200, res.body, petJsonTest);
        })
      })
      .catch((error) => {
        debugger;
        throw error;
      })
  });

  it("PET GET - Get NO pet by ID #0 from the petstore", () => {
    return request('http://localhost:10010')
      .get(`/pet/0`)
      .set('Accept', 'application/json')
      .expect(200, {})
      .catch((error) => {
        debugger;
        throw error;
      })
    });

    it("PET GET - Get pet by ID #11 from the petstore", () => {
    const petJsonTest = JSON.parse(JSON.stringify(mockPet.PET_ID_11));

    return request('http://localhost:10010')
      .get(`/pet/${petJsonTest.id}`)
      .set('Accept', 'application/json')
      .expect( (res) => {
        checkResResponseBodyAfterPurge(res.status, 200, res.body, petJsonTest);
      })
      .catch((error) => {
        debugger;
        throw error;
      })
  });

  it("PET GET findByStatus - Get pet(s) by Status from the petstore", () => {
    const petJsonTest10 = JSON.parse(JSON.stringify(mockPet.PET_ID_10));
    const petJsonTest11 = JSON.parse(JSON.stringify(mockPet.PET_ID_11));

    return request('http://localhost:10010')
      .get(`/pet/findByStatus`)
      .query({status : petJsonTest10.status})
      .set('Accept', 'application/json')
      .expect( (res) => {
        checkResResponseBodyAfterPurge(res.status, 200, res.body[0], petJsonTest10);
        checkResResponseBodyAfterPurge(res.status, 200, res.body[1], petJsonTest11);
      })
      .catch((error) => {
        debugger;
        throw error;
      })
  });

  it("PET GET findPetsByTags - Get pet(s) by Tags from the petstore", () => {
    const testRequest = request('http://localhost:10010');

    const petJsonTest20 = JSON.parse(JSON.stringify(mockPet.PET_ID_10));
    const petJsonTest21 = JSON.parse(JSON.stringify(mockPet.PET_ID_11));

    petJsonTest20.id = 20;
    petJsonTest21.id = 21;
    petJsonTest20.name = 'doggie_20';
    petJsonTest21.name = 'doggie_21';
    petJsonTest20.tags =  [
      {
        "name" : "tag20"
      },
      {
        "name" : "both"
      }
    ];
    petJsonTest21.tags =  [
      {
        "name" : "tag21"
      },
      {
        "name" : "both"
      }
    ];

    return testRequest
      .post(`/pet`)
      .set('Accept', 'application/json')
      .send(petJsonTest20)
      .expect('Content-Type', 'application/json')
      .expect( (res) => {
        checkResResponseBodyAfterPurge(res.status, 200, res.body, petJsonTest20);
      })
      .then(() => {
        return testRequest
        .post(`/pet`)
        .set('Accept', 'application/json')
        .send(petJsonTest21)
        .expect('Content-Type', 'application/json')
        .expect( (res) => {
          checkResResponseBodyAfterPurge(res.status, 200, res.body, petJsonTest21);
        })
      })
      .then(() => {
        return testRequest
        .get(`/pet/findByTags`)
        .query({tags : ['noGoodTagFound']})
        .set('Accept', 'application/json')
        .expect( (res) => {
          expect(res.status).to.equal(200);
          expect(res.body.length).to.equal(0);
        })
      })
      .then(() => {
        return testRequest
        .get(`/pet/findByTags`)
        .query({tags : ['tag20']})
        .set('Accept', 'application/json')
        .expect( (res) => {
          expect(res.status).to.equal(200);
          expect(res.body.length).to.equal(1);
          let expectedJson = _.cloneDeep(petJsonTest20);
          for(let index=0; index < expectedJson.tags.length; index += 1) {
            if (expectedJson.tags[index].name !== 'tag20') {
              expectedJson.tags.splice(index, 1);
            }
          }
          checkResResponseBodyAfterPurge(res.status, 200, res.body[0], expectedJson);
        })
      })
      .then(() => {
        return testRequest
        .get(`/pet/findByTags`)
        .query({tags : ['tag21']})
        .set('Accept', 'application/json')
        .expect( (res) => {
          expect(res.status).to.equal(200);
          expect(res.body.length).to.equal(1);
          let expectedJson = _.cloneDeep(petJsonTest21);
          for(let index=0; index < expectedJson.tags.length; index += 1) {
            if (expectedJson.tags[index].name !== 'tag21') {
              expectedJson.tags.splice(index, 1);
            }
          }
          checkResResponseBodyAfterPurge(res.status, 200, res.body[0], expectedJson);
        })
      })
      .then(() => {
        return testRequest
        .get(`/pet/findByTags`)
        .query({tags : ['both']})
        .set('Accept', 'application/json')
        .expect( (res) => {
          expect(res.status).to.equal(200);
          expect(res.body.length).to.equal(2);
          for(let bIndex=0; bIndex < res.body.length; bIndex += 1) {
            if (res.body[bIndex].id === 20) {
              let expectedJson = _.cloneDeep(petJsonTest20);
              for(let index=0; index < expectedJson.tags.length; index += 1) {
                if (expectedJson.tags[index].name !== 'both') {
                  expectedJson.tags.splice(index, 1);
                }
              }
              checkResResponseBodyAfterPurge(res.status, 200, res.body[bIndex], expectedJson);
            } else if (res.body[bIndex].id === 21) {
              let expectedJson = _.cloneDeep(petJsonTest21);
              for(let index=0; index < expectedJson.tags.length; index += 1) {
                if (expectedJson.tags[index].name !== 'both') {
                  expectedJson.tags.splice(index, 1);
                }
              }
              checkResResponseBodyAfterPurge(res.status, 200, res.body[bIndex], expectedJson);
            } else {
              throw new Error(`Additional results found that are not expected`);
            }
          }
        })
      })
      .catch((error) => {
        debugger;
        throw error;
      })
  });

  it("PET DELETE - Delete pet by ID #10 from the petstore", () => {
    const testRequest = request('http://localhost:10010');

    const petJsonTest = JSON.parse(JSON.stringify(mockPet.PET_ID_10));

    petJsonTest.id = 30;

    return testRequest
      .post(`/pet`)
      .set('Accept', 'application/json')
      .send(petJsonTest)
      .expect('Content-Type', 'application/json')
      .expect( (res) => {
        checkResResponseBodyAfterPurge(res.status, 200, res.body, petJsonTest);
      })
      .then(() => {
        return testRequest
        .delete(`/pet/${petJsonTest.id}`)
        .expect('Content-Type', 'application/json')
        .expect( (res) => {
          checkResResponseBodyAfterPurge(res.status, 200, res.body, petJsonTest);
        })
      })
      .catch((error) => {
        debugger;
        throw error;
      });
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

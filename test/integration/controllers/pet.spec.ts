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
import * as diff from "diff";

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
    console.error(chalk.yellow(`Request body : ${JSON.stringify(requestJson, null, 2)}`));
    console.error(chalk.yellow(`Expected data: ${JSON.stringify(expectedJSON, null, 2)}`));

    console.error(chalk.red(`Differences are (green add, red removed, gray same):`));
    const differences = diff.diffJson(requestJson, expectedJSON);
    differences.forEach((part) => {
      if (part.added) {
        process.stderr.write(chalk.green(part.value));
      } else if (part.removed) {
        process.stderr.write(chalk.red(part.value));
      } else {
        process.stderr.write(chalk.grey(part.value));
      }
    });
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

  it("PET POST - Add a new pet id#10 to the petstore", () => {
    const petJsonTest = JSON.parse(JSON.stringify(mockPet.PET_ID_10));

    return request('http://localhost:10010')
      .post(`/pet`)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .send(petJsonTest)
      .expect( (res) => {
        if (res.status != 200) {
          console.error(chalk.red(`res.text: ${JSON.stringify(res.text, null, 2)}`));
          console.error(chalk.red(`res.body: ${JSON.stringify(res.body, null, 2)}`));
        } else {
          checkJsonAfterPurge(petJsonTest, res.body);
        }
      })
      .expect(200)
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
      .expect('Content-Type', /json/)
      .send(petJsonTest)
      .expect( (res) => {
        if (res.status != 200) {
          console.error(chalk.red(`res.text: ${JSON.stringify(res.text, null, 2)}`));
          console.error(chalk.red(`res.body: ${JSON.stringify(res.body, null, 2)}`));
        } else {
          checkJsonAfterPurge(petJsonTest, res.body);
        }
      })
      .expect(200)
      .catch((error) => {
        debugger;
        throw error;
      })
  });

  it("PET DELETE - Delete pet by ID #10 from the petstore", () => {
    const petJsonTestResult = JSON.parse(JSON.stringify(mockPet.PET_ID_10));
    delete petJsonTestResult['id'];

    return request('http://localhost:10010')
      .delete(`/pet/${mockPet.PET_ID_10.id}`)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect( (res) => {
        if (res.status != 200) {
          console.error(chalk.red(`res.text: ${JSON.stringify(res.text, null, 2)}`));
          console.error(chalk.red(`res.body: ${JSON.stringify(res.body, null, 2)}`));
        } else {
          checkJsonAfterPurge(petJsonTestResult, res.body);
        }
      })
      .expect(200)
      .catch((error) => {
        debugger;
        throw error;
      });
  });

});

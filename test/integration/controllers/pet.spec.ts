// process.env.debug = '*';

import * as request from "supertest";
import * as proxyquire from "proxyquire";
import * as appRoot  from "app-root-path";
import * as path from "path";
import * as mockPet from "../../MockData/mockPet";


const emptyStub   =  { };
const pathDistDirectory = path.join(appRoot.toString(), "dist/src");

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

  it("PET POST - Add a new pet id#11 to the petstore", () => {
    const petJsonTest = JSON.parse(JSON.stringify(mockPet.PET_ID_10));

    return request('http://localhost:10010')
      .post(`/pet`)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .send(petJsonTest)
      .expect( (res) => {
        if (res.status != 200) {
          console.error(`res.text: ${JSON.stringify(res.text, null, 2)}`);
          console.error(`res.body: ${JSON.stringify(res.body, null, 2)}`);
        }
      })
      .expect(200, petJsonTest)
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
          console.error(`res.text: ${JSON.stringify(res.text, null, 2)}`);
          console.error(`res.body: ${JSON.stringify(res.body, null, 2)}`);
        }
      })
      .expect(200, petJsonTest)
      .catch((error) => {
        debugger;
        throw error;
      })
  });

  // it("PET GET by ID - find pet by ID", () => {
  //   const app = proxyquire(pathDistDirectory, { 'emptyStub': emptyStub });
  //   return app.generateInstance()
  //   .then((result) => {
  //     instance = result;
  //   })
  //   .then(() => {
  //     return request(instance)
  //     .get(`/pet/${mockPet.PET_ID_10.id}`)
  //     .expect(200)
  //     .then((res) => {
  //       res.body.should.equal(mockPet.PET_ID_10);
  //     });
  //   })
  //   .catch((err) => {
  //     debugger;
  //     err.message.should.equal(`Error thrown ${err.message}`);
  //   });
  // });

});

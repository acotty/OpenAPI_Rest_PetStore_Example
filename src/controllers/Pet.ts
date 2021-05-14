import { getConnection, getRepository } from "typeorm";
import mPet from "../models/Pet";
import iPet from "../interfaces/Pet";
import * as _ from "lodash";

// const fileName = __filename.split(__dirname+"/").pop();

export class PetController {

  private getNotSupportedJsonObject(){
    const err = new Error();
    const caller_line = err.stack.split("\n")[2];
    const index = caller_line.indexOf("at ");
    const lineDetails = caller_line.slice(index+2, caller_line.length);

    let notSupportedJson = {};
    notSupportedJson['developerMessage'] = `The rest API has not been coded yet, from ${lineDetails}`;
    notSupportedJson['userMessage'] = `The rest API has not been coded yet.`;
    notSupportedJson['moreInfoMessage'] = ``;
    notSupportedJson['debugMessage'] = ``;

    return notSupportedJson;
  }

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  public addPet(typedRequestBodyParam, responder) {

    const petRepository = getRepository(mPet);
    const pet = new mPet();
    const petJson = JSON.parse(JSON.stringify(typedRequestBodyParam));

    return petRepository
      .save({
        ...pet,
        ...petJson,
      })
      .then( (result) => {
        return responder.success(result);
      })
      .catch( (error) => {
        return responder.serverError(error);
      });
  }

  public updatePet(typedRequestBodyParam, responder) {
    return responder.notSupportedError(this.getNotSupportedJsonObject());
  }

  public findPetsByStatus(typedRequestBodyParam, responder) {
    return responder.notSupportedError(this.getNotSupportedJsonObject());
  }

  public indPetsByTags(typedRequestBodyParam, responder) {
    return responder.notSupportedError(this.getNotSupportedJsonObject());
  }

  public getPetById(typedRequestBodyParam, responder) {
    return responder.notSupportedError(this.getNotSupportedJsonObject());
  }

  public updatePetWithForm(typedRequestBodyParam, responder) {
    return responder.notSupportedError(this.getNotSupportedJsonObject());
  }

  public deletePet(typedRequestBodyParam, responder) {
    return responder.notSupportedError(this.getNotSupportedJsonObject());
  }
}

module.exports = PetController;

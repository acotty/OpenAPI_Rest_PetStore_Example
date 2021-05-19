import { getRepository } from "typeorm";
import mPet from "../models/Pet";
// import iPet from "../interfaces/Pet";
// import * as _ from "lodash";

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
    const petRepository = getRepository(mPet);
    const petJson = JSON.parse(JSON.stringify(typedRequestBodyParam));

    return petRepository
      .findOne(petJson)
      .then( (petFound) => {
        return petRepository.save({
          ...petFound,
          ...petJson,
        })
      })
      .then( (result) => {
        return responder.success(result);
      })
      .catch( (error) => {
        return responder.serverError(error);
      });
  }

  private findPet(typedRequestBodyParam, responder) {
    const petRepository = getRepository(mPet);
    const findPetJson = JSON.parse(JSON.stringify(typedRequestBodyParam));

    return petRepository
      .find(findPetJson)
      .then( (petFound) => {
        return responder.success(petFound);
      })
      .catch( (error) => {
        return responder.serverError(error);
      });
  }

  public findPetsByStatus(statusParam, responder) {
    return this.findPet({ status: statusParam}, responder);
  }

  public findPetsByTags(typedRequestBodyParam, responder) {
    return this.findPet(typedRequestBodyParam, responder);
  }

  public getPetById(idParam, responder) {
    return this.findPet({ id: idParam}, responder);
  }

  public updatePetWithForm(typedRequestBodyParam, responder) {
    return responder.notSupportedError(this.getNotSupportedJsonObject());
  }

  public deletePet(idParam, responder) {
    const petRepository = getRepository(mPet);
    const petJson = { id: idParam};

    return petRepository
      .findOne(petJson)
      .then( (petFound) => {
        return petRepository.remove(petFound)
      })
      .then( (result) => {
        return responder.success(result);
      })
      .catch( (error) => {
        return responder.serverError(error);
      });
  }
}

module.exports = PetController;

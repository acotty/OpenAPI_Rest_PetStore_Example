import { getRepository } from "typeorm";
import mPet from "../models/Pet";
import mTag from "../models/Tag";
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

    if (!Object.prototype.hasOwnProperty.call(petJson, 'tags') || (petJson.tags.length === 0)) {
      return petRepository
        .save({
          ...pet,
          ...petJson,
        })
        .then( (resultPet) => {
          return responder.success(resultPet);
        })
        .catch( (error) => {
          return responder.serverError(error);
        });

    } else {
      const tagRepository = getRepository(mTag);
      const tag = new mTag();
      const tagJson = JSON.parse(JSON.stringify(typedRequestBodyParam.tags[0]));

      return tagRepository
        .save({
          ...tag,
          ...tagJson,
        })
        .then( (resultTag) => {
          petJson.tagsId = resultTag.id;
          return petRepository
          .save({
            ...pet,
            ...petJson,
          })
        })
        .then( (resultPet) => {
          return responder.success(resultPet);
        })
        .catch( (error) => {
          return responder.serverError(error);
        });
    }
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

  private findPet(typedRequestBodyParam, expectedMultipePets, responder) {
    const petRepository = getRepository(mPet);
    const findPetJson = JSON.parse(JSON.stringify(typedRequestBodyParam));

    return petRepository
      .find(findPetJson)
      .then( (petFound) => {
        if (expectedMultipePets === false) {
          if (petFound.length == 1) {
            return responder.success(petFound[0]);
          } else {
            return responder.serverError(new Error(`Expected one pet from the DB, but DB returned muliple - ${petFound.length}`));
          }
        } else {
          return responder.success(petFound);
        }
      })
      .catch( (error) => {
        return responder.serverError(error);
      });
  }

  public findPetsByStatus(statusParam, responder) {
    return this.findPet({ status: statusParam}, true, responder);
  }

  public findPetsByTags(typedRequestBodyParams, responder) {
    return this.findPet({ tags: typedRequestBodyParams}, true, responder);
  }

  public getPetById(idParam, responder) {
    return this.findPet({ id: idParam}, false, responder);
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

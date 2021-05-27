/* eslint-disable no-debugger */

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
          debugger;
          return responder.serverError(error);
        });

    } else {
      const tagRepository = getRepository(mTag);
      const tagsArray: mTag[] = [];

      for (let index = 0; index < typedRequestBodyParam.tags.length; index += 1) {
        const tag = new mTag();
        tag.name = typedRequestBodyParam.tags[index].name;
        if (Object.prototype.hasOwnProperty.call(typedRequestBodyParam.tags[index], 'id')) {
          tag.id = typedRequestBodyParam.tags[index].id;
        }
        tagsArray.push(tag);
      }

      return tagRepository
        .save(tagsArray)
        .then( () => {
          return petRepository
            .save(petJson)
        })
        .then( (resultPet) => {
          return responder.success(resultPet);
        })
        .catch( (error) => {
          debugger;
          return responder.serverError(error);
        });
    }
  }

  public updatePet(typedRequestBodyParam, responder) {
    const petRepository = getRepository(mPet);
    const petJson = JSON.parse(JSON.stringify(typedRequestBodyParam));

    return petRepository
      .findOne({id: petJson.id})
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
        debugger;
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
          if (petFound.length == 0) {
            return responder.success();
          } else {
            if (petFound.length == 1) {
              return responder.success(petFound[0]);
            } else {
              return responder.serverError(new Error(`Expected one pet from the DB, but DB returned muliple - ${petFound.length}`));
            }
          }
        } else {
          return responder.success(petFound);
        }
      })
      .catch( (error) => {
        debugger;
        return responder.serverError(error);
      });
  }

  public findPetsByStatus(statusParam, responder) {
    return this.findPet({ status: statusParam}, true, responder);
  }

  public findPetsByTags(typedRequestBodyParams, responder) {

    return getRepository(mPet)
            .createQueryBuilder("pet")
            .leftJoinAndSelect("pet.tags", "tags")
            .where("tags.name in (:...names)", { names: typedRequestBodyParams})
            .getMany()
            .then( (petsFound) => {
              if (petsFound.length == 0) {
                return responder.success([]);
              }  else {
                return responder.success(petsFound);
              }
            })
            .catch( (error) => {
              debugger;
              return responder.serverError(error);
            });
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
        result.id = idParam;
        return responder.success(result);
      })
      .catch( (error) => {
        debugger;
        return responder.serverError(error);
      });
  }
}

module.exports = PetController;

/* eslint-disable no-debugger */
import { getConnection, getRepository } from "typeorm";
import mUser from "../models/User";
import iUser from "../interfaces/User";
import * as _ from "lodash";

export class UserController {

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


  public addUser(typedRequestBodyParam, responder) {
    const userRepository = getRepository(mUser);
    const userJson = JSON.parse(JSON.stringify(typedRequestBodyParam));

    return userRepository
    .save(userJson)
    .then( (resultPet) => {
      return responder.success(resultPet);
    })
    .catch( (error) => {
      debugger;
      return responder.serverError(error);
    });

  }

  public createUsersWithListInput(typedRequestBodyParam, responder) {
    return responder.notSupportedError(this.getNotSupportedJsonObject());
  }

  public updateUserbyID(userID, typedRequestBodyParam, responder) {
    const userRepository = getRepository(mUser);
    const userJson = JSON.parse(JSON.stringify(typedRequestBodyParam));

    return userRepository
      .findOne({id: userID})
      .then( (userFound) => {
        return userRepository.save({
          ...userFound,
          ...userJson,
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

  public loginUser(typedRequestBodyParam, responder) {
    return responder.notSupportedError(this.getNotSupportedJsonObject());
  }

  public logoutUser(typedRequestBodyParam, responder) {
    return responder.notSupportedError(this.getNotSupportedJsonObject());
  }

  public getUserByUserName(userName, responder) {
    const userRepository = getRepository(mUser);

    return userRepository
      .find({userName})
      .then( (userFound) => {
        if (userFound.length == 0) {
          return responder.success();
        } else {
          return responder.success(userFound[0]);
        }
      })
      .catch( (error) => {
        debugger;
        return responder.serverError(error);
      });
  }

  public getUserById(userID, responder) {
    const userRepository = getRepository(mUser);

    return userRepository
      .find({ id: userID})
      .then( (userFound) => {
        if (userFound.length == 0) {
          return responder.notFoundError();
        } else {
          return responder.success(userFound[0]);
        }
      })
      .catch( (error) => {
        debugger;
        return responder.serverError(error);
      });
  }

  public deleteUserbyUserID(userID, responder) {
    const userRepository = getRepository(mUser);

    return userRepository
      .findOne({ id: userID})
      .then( (userFound) => {
        if (userFound === undefined) {
          return responder.notFoundError();
        } else {
          return userRepository.remove(userFound)
        }
      })
      .then( (result) => {
        result.id = userID;   // Add UserID back into the results as it is not in the deleted object
        return responder.success(result);
      })
      .catch( (error) => {
        debugger;
        return responder.serverError(error);
      });
  }

  public deleteUserbyUserName(userName, responder) {
    const userRepository = getRepository(mUser);
    let userIDFound;

    return userRepository
      .findOne({ userName})
      .then( (userFound) => {
        userIDFound = userFound.id;
        return userRepository.remove(userFound)
      })
      .then( (result) => {
        result.id = userIDFound;
        return responder.success(result);
      })
      .catch( (error) => {
        debugger;
        return responder.serverError(error);
      });
  }
}


module.exports = UserController;

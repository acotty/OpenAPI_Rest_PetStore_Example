import { getConnection, getRepository } from "typeorm";
import mOrder from "../models/Order";
import iOrder from "../interfaces/Order";
import * as _ from "lodash";

export class StoreController {

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

  public getStoreInventory(typedRequestBodyParam, responder) {
    return responder.notSupportedError(this.getNotSupportedJsonObject());
  }

  public placeStoreOrder(typedRequestBodyParam, responder) {
    return responder.notSupportedError(this.getNotSupportedJsonObject());
  }

  public getStoreOrderById(typedRequestBodyParam, responder) {
    return responder.notSupportedError(this.getNotSupportedJsonObject());
  }

  public deleteStoreOrder(typedRequestBodyParam, responder) {
    return responder.notSupportedError(this.getNotSupportedJsonObject());
  }

}

module.exports = StoreController;

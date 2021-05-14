import { getRepository } from "typeorm";
import mAddress from "../models/Address";
import iAddress from "../interfaces/Address";

export class AddressController {

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

  public addAddress(typedRequestBodyParam, responder) {
    return responder.notSupportedError(this.getNotSupportedJsonObject());
  }

  public updateAddress(typedRequestBodyParam, responder) {
    return responder.notSupportedError(this.getNotSupportedJsonObject());
  }

  public getAddressByID(typedRequestBodyParam, responder) {
    return responder.notSupportedError(this.getNotSupportedJsonObject());
  }

  public deleteAddress(typedRequestBodyParam, responder) {
    return responder.notSupportedError(this.getNotSupportedJsonObject());
  }
}

module.exports = AddressController;

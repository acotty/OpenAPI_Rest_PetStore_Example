/* eslint-disable no-debugger */
import { getRepository } from "typeorm";
import mAddress from "../models/Address";
// import iAddress from "../interfaces/Address";

export class AddressController {

  public addAddress(typedRequestBodyParam, responder) {
    const addressRepository = getRepository(mAddress);
    const addressJson = JSON.parse(JSON.stringify(typedRequestBodyParam));

    return addressRepository
    .save(addressJson)
    .then( (resultPet) => {
      return responder.success(resultPet);
    })
    .catch( (error) => {
      debugger;
      return responder.serverError(error);
    });

  }

  public updateAddress(typedRequestBodyParam, responder) {
    return this.addAddress(typedRequestBodyParam, responder);
  }

  public getAddressByID(typedRequestBodyParam, responder) {
    const addressRepository = getRepository(mAddress);

    return addressRepository
      .find({ id: typedRequestBodyParam})
      .then( (addressFound) => {
        if (addressFound.length == 0) {
          return responder.success();
        } else {
          return responder.success(addressFound[0]);
        }
      })
      .catch( (error) => {
        debugger;
        return responder.serverError(error);
      });
  }

  public deleteAddress(typedRequestBodyParam, responder) {
    const addressRepository = getRepository(mAddress);

    return addressRepository
      .findOne({ id: typedRequestBodyParam})
      .then( (addressFound) => {
          return addressRepository.remove(addressFound)
      })
      .then( (result) => {
        result.id = typedRequestBodyParam;
        return responder.success(result);
      })
      .catch( (error) => {
        debugger;
        return responder.serverError(error);
      });
  }
}

module.exports = AddressController;

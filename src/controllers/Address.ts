import { getRepository } from "typeorm";
import Address from "../models/Address";
import IAddress from "../interfaces/Address";

const CREATE_SUCCESS_MESSAGE = "Successfully created a new address";
const DELETE_SUCCESS_MESSAGE = "Successfully deleted address";
const GET_SUCCESS_MESSAGE = "Successfully found address";
const UPDATE_SUCCESS_MESSAGE = "Successfully updated address";
const DEFAULT_PAGE_SIZE = 50;

export class AddressController {
    public addAddress(specificationNumber: string, variationNumber: number, responder) {
        return responder.success({
            message: CREATE_SUCCESS_MESSAGE,
            Address,
            });
    }
    public updateAddress(specificationNumber: string, variationNumber: number, responder) {
        return responder.success({
            message: UPDATE_SUCCESS_MESSAGE,
            Address,
            });
    }
    public getAddressByID(specificationNumber: string, variationNumber: number, responder) {
        return responder.success({
            message: UPDATE_SUCCESS_MESSAGE,
            Address,
            });
    }
    public deleteAddress(specificationNumber: string, variationNumber: number, responder) {
        return responder.success({
            message: DELETE_SUCCESS_MESSAGE,
            Address,
            });
    }
}

module.exports = AddressController;

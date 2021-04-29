import { getRepository } from "typeorm";
import Pet from "../models/Pet";
import IPet from "../interfaces/Pet";
import * as _ from "lodash";

const CREATE_SUCCESS_MESSAGE = "Successfully created a new Pet";
const DELETE_SUCCESS_MESSAGE = "Successfully deleted Pet";
const GET_SUCCESS_MESSAGE = "Successfully found Pet";
const UPDATE_SUCCESS_MESSAGE = "Successfully updated Pet";
const DEFAULT_PAGE_SIZE = 50;

export class PetController {
/*
  public createModelStandardLinkAttachment(specificationNumber: string, variationNumber: number,
                                           modelStandardLinkAttachment: any, responder) {
    const data = JSON.parse(JSON.stringify(modelStandardLinkAttachment));
    if (data.hasOwnProperty("_id")) {
      delete data._id;
    }
    data.specificationNumber = specificationNumber;
    data.variationNumber = variationNumber;
    new ModelStandardLinkAttachment(data).save().then((result) => {
      const modelStandardLinkAttachments = [];
      modelStandardLinkAttachments.push(result);
      responder.success({
        message: CREATE_SUCCESS_MESSAGE,
        modelStandardLinkAttachments,
      });
    });
  }

  public countStandardLinkAttachments(specificationNumber: string, responder) {
    const query = { specificationNumber };
    ModelStandardLinkAttachment.count(query)
      .then(async (totalStandardLinkAttachments) => {
        const activeStandardLinkAttachments = await ModelStandardLinkAttachment.count({specificationNumber, status: "active"}).lean();
        const standardLinkAttachments = 0;
        if (!totalStandardLinkAttachments) {
          totalStandardLinkAttachments = standardLinkAttachments;
        }
        return responder.success({
          message: GET_SUCCESS_MESSAGE,
          totalStandardLinkAttachments,
          activeStandardLinkAttachments
        });
      });
  }

  public getById(standardLinkAttachmentId: string, responder) {
    ModelStandardLinkAttachment.findById(standardLinkAttachmentId).then((result) => {
      const modelStandardLinkAttachments = [];
      modelStandardLinkAttachments.push(result);
      return responder.success({
        message: GET_SUCCESS_MESSAGE,
        modelStandardLinkAttachments,
      });
    });
  }

  public deleteModelStandardLinkAttachmentById(standardLinkAttachmentId: string, responder) {
    ModelStandardLinkAttachment.findByIdAndRemove(standardLinkAttachmentId).then((result) => {
      const modelStandardLinkAttachments = [];
      modelStandardLinkAttachments.push(result);
      return responder.success({
        message: DELETE_SUCCESS_MESSAGE,
        modelStandardLinkAttachments,
      });
    });
  }

  public deleteBySpecificationAndVariationNumber(specificationNumber: string, variationNumber: number, responder) {
    ModelStandardLinkAttachment.find({specificationNumber, variationNumber}).lean()
    .then(async (result: [any]) => {
      for (const pcAttach of result) {
        if (!pcAttach.lastUpdated) {
          await ModelStandardLinkAttachment.findByIdAndRemove(pcAttach._id).exec();
        }
      }
      const totalStandardLinkAttachments = await ModelStandardLinkAttachment.count({specificationNumber}).exec();
      const modelStandardLinkAttachments = [];
      modelStandardLinkAttachments.push(result);
      return responder.success({
        message: DELETE_SUCCESS_MESSAGE,
        modelStandardLinkAttachments,
        totalStandardLinkAttachments
      });
    });
  }

  public getBySpecificationNumber(specificationNumber: string, searchQuery: number, startrow: number, endrow: number, responder) {
    let limit;
    let query;
    if (searchQuery !== undefined) {
      query = { $and: [ {specificationNumber}, { $where: `/${searchQuery}/.test(this.variationNumber)`}]};
    } else {
      query = {specificationNumber};
    }
    startrow = startrow || 0;
    startrow = startrow > 0 ? startrow - 1 : 0;
    if (endrow || endrow === 0) {
      limit = 0;
      if (endrow > 0) {
        limit = endrow - startrow;
      }
    } else {
      limit = DEFAULT_PAGE_SIZE;
    }

    ModelStandardLinkAttachment.find(query).sort({ variationNumber: 1, totalStartupPercentage: 1}).lean()
      .then(async (response: [any]) => {
        let progressiveSettingsPcAttachArray;
        const index = response.findIndex((item, i) => {
          return item.variationNumber === 99;
        });
        const endIndex = response.findIndex((item, i) => {
          return item.variationNumber > 99;
        });

        if (index === -1 && endIndex === -1) {
          progressiveSettingsPcAttachArray = response;
        } else {
          const leftSide = (endIndex === -1) ? _.slice(response, index) : _.slice(response, index, endIndex);
          const rightSide = _.pullAll(response, leftSide);
          progressiveSettingsPcAttachArray = leftSide.concat(rightSide);
        }
        progressiveSettingsPcAttachArray = await _.slice(progressiveSettingsPcAttachArray, startrow, endrow);
        await this.countFilteredStandardLinkAttachments(query)
          .then((totalStandardLinkAttachments) => {
            return responder.success({
              message: GET_SUCCESS_MESSAGE,
              modelStandardLinkAttachments: progressiveSettingsPcAttachArray,
              totalStandardLinkAttachments,
            });
          });
      });
  }

  public getBySpecificationAndVariationNumber(specificationNumber: string, variationNumber: number, responder) {
    const query = { specificationNumber, variationNumber };
    ModelStandardLinkAttachment.find(query).sort({ createdAt: 1 }).lean()
    .then((modelStandardLinkAttachments) => {
      return responder.success({
        message: GET_SUCCESS_MESSAGE,
        modelStandardLinkAttachments,
      });
    });
  }

  public updateModelStandardLinkAttachmentById(id: string, modelStandardLinkAttachment: any, responder) {
    const modelStandardLinkAttachmentObj = JSON.parse(JSON.stringify(modelStandardLinkAttachment));
    if (modelStandardLinkAttachmentObj.hasOwnProperty("_id")) {
      delete modelStandardLinkAttachmentObj._id;
    }
    ModelStandardLinkAttachment.findByIdAndUpdate(id, { $set: modelStandardLinkAttachmentObj }, { new: true },
      (err, result) => {
        const modelStandardLinkAttachments = [];
        modelStandardLinkAttachments.push(result);
        return responder.success({
          message: UPDATE_SUCCESS_MESSAGE,
          modelStandardLinkAttachments,
        });
      });
  }

  private countFilteredStandardLinkAttachments(query): Promise<any> {
    return ModelStandardLinkAttachment.count(query)
      .then((totalStandardLinkAttachments) => {
        const standardLinkAttachments = 0;
        if (!totalStandardLinkAttachments) {
          totalStandardLinkAttachments = standardLinkAttachments;
        }
        return totalStandardLinkAttachments;
      });
  }

  public async getByVersionId(versionId: string, searchQuery: number, startrow: number, endrow: number, responder) {
    let limit;
    let query;
    startrow = startrow || 0;
    startrow = startrow > 0 ? startrow - 1 : 0;
    if (endrow || endrow === 0) {
      limit = 0;
      if (endrow > 0) {
        limit = endrow - startrow;
      }
    } else {
      limit = DEFAULT_PAGE_SIZE;
    }
    const version: any = await ModelVersion.findById(versionId).lean();
    const specificationNumber = version.specificationNumber;
    let standardLinkAttachments = version.standardLinkAttachments;
    if (!standardLinkAttachments) {
      return responder.badRequest({
        errorCode: 400,
        errorId: 1,
        message: `No standardLinkAttachments found for ${versionId}`,
      });
    }
    standardLinkAttachments = _.sortBy(standardLinkAttachments, ["variationNumber", "totalStartupPercentage"]);
    let progressiveSettingsPcAttachArray: any = [];
    if (searchQuery !== undefined) {
      query = {
        $and: [
          {specificationNumber},
          { $where: `/${searchQuery}/.test(this.variationNumber)`}
        ]
      };
      progressiveSettingsPcAttachArray = await ModelStandardLinkAttachment.find(query).sort({ variationNumber: 1, totalStartupPercentage: 1}).skip(startrow).limit(limit).lean();
    } else {
      standardLinkAttachments = _.slice(standardLinkAttachments, startrow, endrow);
      for (const standardLinkAttachment of standardLinkAttachments) {
        query = {
          $and: [
            { specificationNumber: version.specificationNumber },
            { totalStartupPercentage: standardLinkAttachment.totalStartupPercentage },
            { variationNumber: standardLinkAttachment.variationNumber},
            { incrementPercentage: standardLinkAttachment.incrementPercentage}
          ]
        };
        const modelStandardLinkAttachment = await ModelStandardLinkAttachment.findOne(query).lean();
        if (modelStandardLinkAttachment) {
          progressiveSettingsPcAttachArray.push(modelStandardLinkAttachment);
        }
      }
      progressiveSettingsPcAttachArray = _.sortBy(progressiveSettingsPcAttachArray, ["variationNumber", "totalStartupPercentage"]);
    }
    let modelStandardLinkAttachments: any[];
    const index = progressiveSettingsPcAttachArray.findIndex((item, i) => {
      return item.variationNumber === 99;
    });
    const endIndex = progressiveSettingsPcAttachArray.findIndex((item, i) => {
      return item.variationNumber > 99;
    });
    if (index === -1 && endIndex === -1) {
      modelStandardLinkAttachments = progressiveSettingsPcAttachArray;
    } else {
      const leftSide = (endIndex === -1) ? _.slice(progressiveSettingsPcAttachArray, index) : _.slice(progressiveSettingsPcAttachArray, index, endIndex);
      const rightSide = _.pullAll(progressiveSettingsPcAttachArray, leftSide);
      modelStandardLinkAttachments = leftSide.concat(rightSide);
    }

    return responder.success({
      message: GET_SUCCESS_MESSAGE,
      modelStandardLinkAttachments,
      totalStandardLinkAttachments: modelStandardLinkAttachments.length
    });
  }
*/


  public findPetsByStatus(status: string, responder) {
    const FakePet = {
      id: 1,
      name: "Fake pet",
      category: "category",
      photoUrls: ["none"],
      tags: ["none"],
      status: status
    };

    return responder.success(
      [FakePet]
    );
  }

  public async  deletePet(petId: number, responder) {

    return responder.success( {
      type: petId.toString(),
      message: DELETE_SUCCESS_MESSAGE,
    });
  }

}

module.exports = PetController;

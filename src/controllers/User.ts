//import { getRepository } from "typeorm";
//import Pet from "../models/Pet";
//import IPet from "../interfaces/Pet";
//import * as _ from "lodash";

// const CREATE_SUCCESS_MESSAGE = "Successfully created a new User";
// const DELETE_SUCCESS_MESSAGE = "Successfully deleted User";
// const GET_SUCCESS_MESSAGE = "Successfully found Users";
// const UPDATE_SUCCESS_MESSAGE = "Successfully updated User";
// const DEFAULT_PAGE_SIZE = 50;

export class UserController {
/*
  public createUser(specificationNumber: string, User: any, responder) {
    const data = JSON.parse(JSON.stringify(User));
    if (data.hasOwnProperty("_id")) {
      delete data._id;
    }
    data.specificationNumber = specificationNumber;
    new User(data).save().then((result) => {
      const Users = [];
      Users.push(result);
      return responder.success({
        message: CREATE_SUCCESS_MESSAGE,
        Users,
      });
    });
  }

  public deleteUser(modelSpecificationNumber: string, progressiveSettingNumber: number, responder) {
    User.findOneAndRemove({
      settingNumber: progressiveSettingNumber,
      specificationNumber: modelSpecificationNumber
    }, null,
      (err, result) => {
      const promiseArray = [];
      const Users = [];
      Users.push(result);
      User.find({specificationNumber: modelSpecificationNumber, settingNumber: { $gt: progressiveSettingNumber} }).sort({settingNumber: 1}).lean()
      .then((progressiveSettings: any[]) => {
        progressiveSettings.forEach((progressiveSetting) => {
          const settingId = progressiveSetting._id.toString();
          progressiveSetting.settingNumber = progressiveSetting.settingNumber - 1;
          promiseArray.push(this.updateUserById(settingId, progressiveSetting, null));
        });
        Promise.all(promiseArray).then((values) => {
          return responder.success({
            message: DELETE_SUCCESS_MESSAGE,
            Users,
          });
        });
      });
    });
  }

  public countProgressiveSettings(specificationNumber: string, responder) {
    const query = { specificationNumber };
    let maxSettingNumber = 0;
    User.findOne(query).sort({settingNumber: -1}).lean()
    .then((progressiveSetting: any) => {
      if (progressiveSetting) {
        maxSettingNumber = progressiveSetting.settingNumber;
      }
    });
    User.count(query)
    .then(async (totalProgressiveSettings) => {
      const activeProgressiveSettings = await User.count({specificationNumber, status: "active"}).lean();
      const progressiveSettings = 0;
      if (!totalProgressiveSettings) {
        totalProgressiveSettings = progressiveSettings;
      }
      return responder.success({
        maxSettingNumber,
        message: GET_SUCCESS_MESSAGE,
        totalProgressiveSettings,
        activeProgressiveSettings
      });
    });
  }

  public getById(progressiveSettingId: string, responder) {
    User.findById(progressiveSettingId).then((result) => {
      const Users = [];
      Users.push(result);
      return responder.success({
        message: GET_SUCCESS_MESSAGE,
        Users,
      });
    });
  }

  public async getBySpecificationNumber(specificationNumber: string, searchQuery: string, startrow: number, endrow: number, responder) {
    let limit;
    let query;
    let Users;

    if (searchQuery === "unapproved") {
      Users = await this.getUnApprovedSettings(specificationNumber);
      return responder.success({
        message: GET_SUCCESS_MESSAGE,
        Users,
        totalProgressiveSettings: 0,
      });
    }
    if (searchQuery !== undefined) {
      const searchQueryFormatted = Number(searchQuery);
      query = { $and: [ {specificationNumber}, { $where: `/${searchQueryFormatted}/.test(this.settingNumber)`}]};
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
    User.find(query).sort({ settingNumber: 1 }).skip(startrow).limit(limit).lean()
      .then(async (result) => {
        Users = result;
        this.countSettings(query)
          .then((totalProgressiveSettings) => {
            return responder.success({
              message: GET_SUCCESS_MESSAGE,
              Users,
              totalProgressiveSettings,
            });
          });
      });
  }

  public getBySpecificationNumberAndSettingNumber(
    modelSpecificationNumber: string, UserNumber: number, responder) {
    User.findOne({
      settingNumber: UserNumber,
      specificationNumber: modelSpecificationNumber,
    })
      .then((result) => {
        const Users = [];
        Users.push(result);
        return responder.success({
          message: GET_SUCCESS_MESSAGE,
          Users,
        });
      });
  }

  public updateBySpecificationNumberAndSettingNumber(
    modelSpecificationNumber: string, UserNumber: number, User: any, responder) {
    const UserObj = JSON.parse(JSON.stringify(User));
    if (UserObj.hasOwnProperty("_id")) {
      delete UserObj._id;
    }
    const query = { $and: [{ specificationNumber: { $eq: modelSpecificationNumber } },
      { settingNumber: { $eq: UserNumber } }] };
    User.findOneAndUpdate(query, { $set: UserObj }, { new: true },
      (err, result) => {
        const Users = [];
        Users.push(result);
        return responder.success({
          message: UPDATE_SUCCESS_MESSAGE,
          Users,
        });
      });
  }

  public updateUserById(id: string, User: any, responder) {
    const UserObj = JSON.parse(JSON.stringify(User));
    if (UserObj.hasOwnProperty("_id")) {
      delete UserObj._id;
    }
    User.findByIdAndUpdate(id, { $set: UserObj }, { new: true },
      (err, result) => {
        const Users = [];
        Users.push(result);
        if (responder) {
          return responder.success({
            message: UPDATE_SUCCESS_MESSAGE,
            Users,
          });
        }
      });
  }

  private countSettings(query): Promise<any> {
    return User.count(query)
      .then((totalProgressiveSettings) => {
        const progressiveSettings = 0;
        if (!totalProgressiveSettings) {
          totalProgressiveSettings = progressiveSettings;
        }
        return totalProgressiveSettings;
      });
  }

  public getUnApprovedSettings(specificationNumber: string): Promise<any> {
    return User.find({specificationNumber, lastUpdated: {$exists: false}}).sort({ settingNumber: 1 }).lean()
      .then(async (result) => {
        return result;
      });
  }

  public async getByVersionId(versionId: string, searchQuery: string, startrow: number, endrow: number, responder) {
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
    const settingNumbers: [any] = version.progressiveSettings;
    if (!settingNumbers) {
      return responder.badRequest({
        errorCode: 400,
        errorId: 1,
        message: `No Progressive settings found for ${versionId}`,
      });
    }
    const specificationNumber = version.specificationNumber;
    if (searchQuery !== undefined) {
      const searchQueryFormatted = Number(searchQuery);
      query = {
        $and: [
          { specificationNumber },
          { $where: `/${searchQueryFormatted}/.test(this.settingNumber)` }
        ]
      };
    } else {
      query = {
        $and: [
          { specificationNumber },
          { settingNumber: {
              $in: version.progressiveSettings
            }
          }
        ]
      };
    }
    User.find(query).sort({ settingNumber: 1 }).skip(startrow).limit(limit).lean()
    .then(async (result) => {
      this.countSettings(query)
        .then((totalProgressiveSettings) => {
          return responder.success({
            message: GET_SUCCESS_MESSAGE,
            Users: result,
            totalProgressiveSettings,
          });
        });
    })
    .catch((error) => {
      return responder.error({
        errorCode: 500,
        errorId: 1,
        message: `there was error: ${JSON.stringify(error)}`,
      });
    });
  }

  public getAllSettingNumbersBySpecificationNumber(specificationNumber: string, responder) {
    User.find({specificationNumber}, {settingNumber: 1, status: 1, _id: 0}).sort({ settingNumber: 1 }).lean()
    .then((res: any[]) => {
      if (res.length < 1) {
        return responder.badRequest({
          errorCode: 400,
          errorId: 1,
          message: `No Progressive settings found for ${specificationNumber}`,
        });
      }
      return responder.success({
        message: GET_SUCCESS_MESSAGE,
        Users: res,
        activeProgressiveSettings: res.length
      });
    });
  }
*/
}

module.exports = UserController;

"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

require("@babel/polyfill/noConflict");

var _axios = _interopRequireDefault(require("axios"));

var _formData = _interopRequireDefault(require("form-data"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class PostAffiliatePro {
  constructor(urlServer, urlLogin, username, password, options) {
    this.urlServer = urlServer;
    this.urlLogin = urlLogin;
    this.username = username;
    this.password = password;
    this.cookies = null;
    this.session = null;
    this.options = options ? options : [["rememberMe", "Y"], ["language", "fr-FR"]];
  }

  async __getSession() {
    let requestSession = await _axios.default.get(this.urlLogin);
    if (requestSession.headers && requestSession.headers["set-cookie"] && Array.isArray(requestSession.headers["set-cookie"])) this.session = requestSession.headers["set-cookie"][0].split(";")[0].replace("A=", "");
    return this.session;
  }

  async __authentication() {
    let bodyFormData = new _formData.default(); //if (!this.session)
    //await this.__getSession();

    let fields = [["name", "value"], ["username", this.username], ["password", this.password]];

    if (this.options) {
      fields.push(...this.options);
    }

    bodyFormData.append("D", JSON.stringify({
      "C": "Gpf_Rpc_Server",
      "M": "run",
      "requests": [{
        "C": "Gpf_Api_AuthService",
        "M": "authenticate",
        "fields": fields
      }]
    }));
    let login = await (0, _axios.default)({
      method: "POST",
      url: this.urlServer,
      data: bodyFormData.getBuffer(),
      headers: _objectSpread({}, bodyFormData.getHeaders())
    });
    if (login && login.headers && login.headers["set-cookie"]) this.cookies = login.headers["set-cookie"].join(";");
    let o = await this.__parseResult(login.data);

    if (o.fields && o.fields.length > 0) {
      this.session = await this.getValue(o.fields, "S");
    }

    return true;
  }

  async __getAPI(data) {
    if (!this.cookies) await this.__authentication();
    data.S = this.session;
    let bodyFormData = new _formData.default();
    bodyFormData.append("D", JSON.stringify(data));
    let response = await (0, _axios.default)({
      method: "POST",
      url: this.urlServer,
      data: bodyFormData.getBuffer(),
      headers: _objectSpread({
        "Cookie": `A=${this.session}; ${this.cookies}`
      }, bodyFormData.getHeaders())
    });
    return response.data;
  }

  async __parseResult(result) {
    if (result.length > 0) {
      let returnData = [],
          returnFields = [],
          headers = [],
          count = 0;

      if (result[0].rows || result[0].fields) {
        let rows = result[0].rows;
        let fields = result[0].fields ? result[0].fields : null;
        count = result[0].count;

        for (let key in rows) {
          if (key == 0) headers = rows[0];else {
            let tmpItem = {};

            for (let keyHeader in headers) tmpItem[headers[keyHeader]] = rows[key][keyHeader];

            returnData.push(tmpItem);
          }
        }

        if (fields) {
          for (let key in fields) {
            if (key == 0) headers = fields[0];else {
              let tmpItem = {};

              for (let keyHeader in headers) tmpItem[headers[keyHeader]] = fields[key][keyHeader];

              returnFields.push(tmpItem);
            }
          }
        }
      } else {
        let rows = result[0];

        for (let key in rows) {
          if (key == 0) headers = rows[0];else {
            let tmpItem = {};

            for (let keyHeader in headers) tmpItem[headers[keyHeader]] = rows[key][keyHeader];

            returnData.push(tmpItem);
          }
        }
      }

      return {
        data: returnData,
        fields: returnFields,
        count: count
      };
    } else {
      return null;
    }
  }

  async getValue(fields, key) {
    let value = null;

    if (fields.length > 0) {
      fields.forEach(function (field) {
        if (field.name === key && field.value) {
          value = field.value;
        }
      });
    }

    return value;
  }

  async command(data) {
    let result = await this.__getAPI(data);
    if (result) result = this.__parseResult(result);
    return result;
  }

  async commandResponse(data) {
    return await this.__getAPI(data);
  }
  /**
   *
   * @param offset
   * @param limit
   * @returns {Promise<*>}
   */


  async affiliatesInCampaigns(offset, limit) {
    let campaigns = await this.command({
      "C": "Gpf_Rpc_Server",
      "M": "run",
      "requests": [{
        "C": "Pap_Features_Common_AffiliateCampaignsGrid",
        "M": "getRows",
        "offset": offset,
        "limit": limit
      }]
    });
    return campaigns.data;
  }
  /**
   *
   * @param offset
   * @param limit
   * @returns {Promise<*>}
   */


  async affiliates(offset, limit) {
    let affiliates = await this.command({
      "C": "Gpf_Rpc_Server",
      "M": "run",
      "requests": [{
        "C": "Pap_Merchants_User_TopAffiliatesGrid",
        "M": "getRows",
        "offset": offset,
        "limit": limit
      }]
    });
    return affiliates.data;
  }
  /**
   *
   * @param email : string
   * @param password : string
   * @param firstname : string
   * @param lastname : string A|D|P
   * @param status : string
   * @param parentuserid : string
   * @param managername : string
   * @param refid : string
   * @param company : string|null
   * @param address : string|null
   * @param street : string|null
   * @param city : string|null
   * @param state : string|null
   * @param country : string|null
   * @param postalcode : string|null
   * @param phonenumber : string|null
   * @param fax : string|null
   * @returns {Promise<*>}
   */


  async addAffiliate(email, password, firstname, lastname, status, parentuserid, managername, refid, company, address, street, city, state, country, postalcode, phonenumber, fax) {
    let params = [["name", "value"], ["Id", ""], ["username", email], ["rpassword", password], ["customTimezone", ""], ["useCustomTimezone", "N"], ["lang", ""], ["photo", ""], ["note", ""], ["dontSendEmail", "Y"], ["createSignupReferralComm", "N"]];
    if (firstname) params.push(["firstname", firstname]);
    if (lastname) params.push(["lastname", lastname]);
    if (status) params.push(["rstatus", status]);
    if (parentuserid) params.push(["parentuserid", parentuserid]);
    if (refid) params.push(["refid", refid]);
    if (address) params.push(["data1", address]);
    if (company) params.push(["data2", company]);
    if (street) params.push(["data3", street]);
    if (city) params.push(["data4", city]);
    if (state) params.push(["data5", state]);
    if (country) params.push(["data6", country]);
    if (postalcode) params.push(["data7", postalcode]);
    if (phonenumber) params.push(["data8", phonenumber]);
    if (fax) params.push(["data9", fax]);
    if (managername) params.push(["data10", managername]);
    let add = await this.command({
      "C": "Gpf_Rpc_Server",
      "M": "run",
      "requests": [{
        "C": "Pap_Merchants_User_AffiliateForm",
        "M": "add",
        "fields": params
      }]
    });
    return add;
  }

  async updateAffiliate(affiliateid, email, password, firstname, lastname, status, parentuserid, managername, refid, company, address, street, city, state, country, postalcode, phonenumber, fax) {
    let params = [["name", "value"], ["Id", affiliateid], ["username", email], ["customTimezone", ""], ["useCustomTimezone", "N"], ["lang", ""], ["photo", ""], ["note", ""], ["dontSendEmail", "Y"], ["createSignupReferralComm", "N"]];
    if (password) params.push(["rpassword", password]);
    if (firstname) params.push(["firstname", firstname]);
    if (lastname) params.push(["lastname", lastname]);
    if (status) params.push(["rstatus", status]);
    if (parentuserid) params.push(["parentuserid", parentuserid]);
    if (refid) params.push(["refid", refid]);
    if (address) params.push(["data1", address]);
    if (company) params.push(["data2", company]);
    if (street) params.push(["data3", street]);
    if (city) params.push(["data4", city]);
    if (state) params.push(["data5", state]);
    if (country) params.push(["data6", country]);
    if (postalcode) params.push(["data7", postalcode]);
    if (phonenumber) params.push(["data8", phonenumber]);
    if (fax) params.push(["data9", fax]);
    if (managername) params.push(["data10", managername]);
    let update = await this.command({
      "C": "Gpf_Rpc_Server",
      "M": "run",
      "requests": [{
        "C": "Pap_Merchants_User_AffiliateForm",
        "M": "save",
        "fields": params
      }]
    });
    return update;
  }
  /**
   *
   * @param status : A|D|P
   * @param ids : [string]
   * @returns {Promise<*>}
   */


  async changeStatusAffiliate(status, ids) {
    let change = await this.command({
      "C": "Gpf_Rpc_Server",
      "M": "run",
      "requests": [{
        "C": "Pap_Merchants_User_AffiliateForm",
        "M": "changeStatus",
        "status": status,
        "dontSendNotification": "Y",
        "ids": ids
      }]
    });
    return change;
  }
  /**
   * @param ids : [string]
   * @returns {Promise<*>}
   */


  async deleteAffiliate(ids) {
    let deleted = await this.command({
      "C": "Gpf_Rpc_Server",
      "M": "run",
      "requests": [{
        "C": "Pap_Merchants_User_AffiliateForm",
        "M": "deleteRows",
        "moveChildAffiliates": "N",
        "ids": ids
      }]
    });
    return deleted;
  }
  /**
   * @param category: string|null
   * @param offset
   * @param limit
   * @returns {Promise<*>}
   */


  async campaigns(category, offset, limit) {
    let filters = [["rstatus", "IN", "A"], ["rtype", "IN", "P"]];

    if (category) {
      filters.push(["campaigncategoryid", "IN", category]);
    }

    let campaigns = await this.command({
      "C": "Gpf_Rpc_Server",
      "M": "run",
      "requests": [{
        "C": "Pap_Merchants_Campaign_CampaignsGrid",
        "M": "getRows",
        "offset": offset,
        "limit": limit,
        "sort_col": "rorder",
        "sort_asc": true,
        "filters": filters
      }]
    });
    return campaigns;
  }
  /**
   *
   * @param filters : []
   * @returns {Promise<*>}
   */


  async campaignsInfos(filters) {
    let infos = await this.command({
      "C": "Gpf_Rpc_Server",
      "M": "run",
      "requests": [{
        "C": "Pap_Merchants_Campaign_CampaignsInfoData",
        "M": "load",
        //"filters": [["dateinserted","DP","TM"]]
        "filters": filters
      }]
    });
    return infos.data;
  }
  /**
   *
   * @param categoryid
   * @param offset
   * @param limit
   * @returns {Promise<*>}
   */


  async promo(categoryid, offset, limit) {
    let coupons = await this.command({
      "C": "Gpf_Rpc_Server",
      "M": "run",
      "requests": [{
        "C": "Pap_Affiliates_Promo_BannersGrid",
        "M": "getRows",
        "offset": offset,
        "limit": limit,
        "filters": [["type", "IN", "A,E,I,T"], ["categoryid", "=", categoryid]],
        "columns": [["id"], ["destinationurl"], ["name"], ["campaignid"], ["campaignname"], ["bannercode"], ["bannerdirectlinkcode"], ["bannerpreview"], ["rtype"], ["displaystats"], ["channelcode"], ["campaigndetails"]]
      }]
    });
    return coupons.data;
  }
  /**
   *
   * @param campaignid : string|null
   * @param affiliateid : string|null
   * @param bannerid : string|null
   * @returns {Promise<*>}
   */


  async report(campaignid, affiliateid, bannerid, status, datestart, dateend) {
    let filters = [];
    if (campaignid) filters.push(["campaignid", "E", campaignid]);
    if (affiliateid) filters.push(["userid", "E", affiliateid]);
    if (bannerid) filters.push(["bannerid", "E", bannerid]);
    if (status) filters.push(["rstatus", "IN", status]);

    if (datestart && dateend) {
      // 2020-07-31
      filters.push(["datetime", "D>=", datestart]);
      filters.push(["datetime", "D<=", dateend]);
    } //filters.push(["datetime", "DP", "L30D"]);


    let report = await this.commandResponse({
      "C": "Gpf_Rpc_Server",
      "M": "run",
      "requests": [{
        "C": "Pap_Merchants_Reports_TrafficStatsData",
        "M": "load",
        "filters": filters
      }]
    });
    return report;
  }
  /**
   *
   * @param campaignid : string|null
   * @param affiliateid : string|null
   * @param bannerid : string|null
   * @param type : string|null
   * @param datestart : string|null
   * @param dateend : string|null
   * @param offset : int
   * @param limit : int
   * @returns {Promise<*>}
   */


  async reportClicks(campaignid, affiliateid, bannerid, type, datestart, dateend, offset, limit) {
    let filters = [];
    if (campaignid) filters.push(["campaignid", "E", campaignid]);
    if (affiliateid) filters.push(["userid", "E", affiliateid]);
    if (type) filters.push(["rtype", "IN", type]); // R,U,D : (Repeated / Unique / Denied)

    if (bannerid) filters.push(["bannerid", "E", bannerid]);

    if (datestart && dateend) {
      // 2020-07-31
      filters.push(["datetime", "D>=", datestart]);
      filters.push(["datetime", "D<=", dateend]);
    }

    let clicks = await this.command({
      "C": "Gpf_Rpc_Server",
      "M": "run",
      "requests": [{
        "C": "Pap_Merchants_Reports_ClicksGrid",
        "M": "getRows",
        "sort_col": "datetime",
        "sort_asc": false,
        "offset": offset,
        "limit": limit,
        "filters": filters,
        "columns": [["id"], ["id"], ["firstname"], ["lastname"], ["userid"], ["userstatus"], ["bannerid"], ["banner"], ["campaignid"], ["campaign"], ["countrycode"], ["rtype"], ["datetime"], ["referrerurl"], ["destinationurl"], ["visitorid"], ["ip"], ["cdata1"], ["cdata2"]]
      }]
    });
    return clicks;
  }
  /**
   *
   * @param campaignid : string|null
   * @param affiliateid : string|null
   * @param bannerid : string|null
   * @param type : string|null
   * @param payoutstatus : string|null
   * @param visitorid : string|null
   * @param datestart : string|null
   * @param dateend : string|null
   * @param offset : int
   * @param limit : int
   * @returns {Promise<*>}
   */


  async reportTransactions(campaignid, affiliateid, bannerid, type, payoutstatus, visitorid, datestart, dateend, offset, limit) {
    let filters = [];
    if (campaignid) filters.push(["campaignid", "E", campaignid]);
    if (affiliateid) filters.push(["userid", "E", affiliateid]);
    if (bannerid) filters.push(["bannerid", "E", bannerid]);
    if (type) filters.push(["rtype", "IN", type]); // "S,A"

    if (payoutstatus) filters.push(["payoutstatus", "IN", payoutstatus]); // "P"

    if (visitorid) filters.push(["visitorid", "E", visitorid]);

    if (datestart && dateend) {
      // 2020-07-31
      filters.push(["dateinserted", "D>=", datestart]);
      filters.push(["dateinserted", "D<=", dateend]);
    }

    let transactions = await this.command({
      "C": "Gpf_Rpc_Server",
      "M": "run",
      "requests": [{
        "C": "Pap_Merchants_Transaction_TransactionsGrid",
        "M": "getRows",
        "sort_col": "dateinserted",
        "sort_asc": false,
        "offset": offset,
        "limit": limit,
        "filters": filters,
        "columns": [["id"], ["id"], ["commission"], ["totalcost"], ["t_orderid"], ["productid"], ["dateinserted"], ["name"], ["rtype"], ["tier"], ["commissionTypeName"], ["rstatus"], ["payoutstatus"], ["firstname"], ["lastname"], ["userid"], ["bannerid"], ["campaignid"], ["banner"], ["campaign"], ["cdata1"], ["userstatus"], ["actions"]]
      }]
    });
    return transactions;
  }

  async invoices(affiliateid, offset, limit) {
    let invoices = await this.command({
      "C": "Gpf_Rpc_Server",
      "M": "run",
      "requests": [{
        "C": "Pap_Merchants_Payout_PayoutsToAffiliatesGrid",
        "M": "getRows",
        "sort_col": "dateinserted",
        "sort_asc": true,
        "offset": offset,
        "limit": limit,
        "filters": [["userid", "E", affiliateid]],
        "columns": [["id"], ["id"], ["payouthistoryid"], ["dateinserted"], ["firstname"], ["lastname"], ["userid"], ["userstatus"], ["amount"], ["affiliatenote"], ["actions"]]
      }]
    });
    return invoices;
  }

  async downloadInvoice(invoiceid) {
    let invoice = await this.commandResponse({
      "C": "Gpf_Rpc_Server",
      "M": "run",
      "requests": [{
        "C": "Pap_Merchants_Payout_PayoutHistoryForm",
        "M": "downloadAsPdf",
        "invoiceId": invoiceid,
        "FormResponse": "Y",
        "FormRequest": "Y"
      }]
    }); // https://arya.postaffiliatepro.com/scripts/server.php?C=Pap_Merchants_Payout_PayoutHistoryForm&M=downloadAsPdf&S=v2tanoufspjxxkwrjkp0sca5wo8u6f46&FormRequest=Y&invoiceId=lxnh7b03&FormResponse=Y

    return invoice;
  }
  /**
   *
   * @param url
   * @param campaignid
   * @returns {Promise<*>}
   */


  async deeplink(url, campaignid) {
    let deeplink = await this.command({
      "C": "Gpf_Rpc_Server",
      "M": "run",
      "requests": [{
        "C": "Gpf_Rpc_Server",
        "M": "run",
        "requests": [{
          "C": "Pap_Affiliates_Promo_DynamicLink",
          "M": "getDeeplinkCode",
          "fields": [["name", "value"], ["desturl", url], ["campaignId", campaignid]]
        }]
      }]
    });
    return deeplink.fields[2].value;
  }
  /**
   * @param campaignid : int|null
   * @param categories : string|null
   * @param offset : int
   * @param limit : int
   * @returns {Promise<void>}
   */


  async banners(campaignid, categories, offset, limit) {
    let filters = [["rstatus", "NE", "N"], ["type", "IN", "A"]];
    if (categories) filters.push(["categoryid", "IN", categories]);
    if (campaignid) filters.push(["campaignid", "E", campaignid]);
    let banners = await this.command({
      "C": "Gpf_Rpc_Server",
      "M": "run",
      "requests": [{
        "C": "Pap_Merchants_Banner_BannersGrid",
        "M": "getRows",
        "sort_col": "rorder",
        "sort_asc": true,
        "offset": offset,
        "limit": limit,
        "filters": filters,
        "columns": [["id"], ["id"], ["banner"], ["rtype"], ["isconfirmed"], ["destinationurl"], ["rstatus"], ["categoryid"], ["rorder"], ["actions"]]
      }]
    });
    return banners;
  }

  async reportPayouts(affiliateid) {
    let filters = [];
    if (affiliateid) filters.push(["userid", "E", affiliateid]);
    let report = await this.command({
      "C": "Gpf_Rpc_Server",
      "M": "run",
      "requests": [{
        "C": "Pap_Merchants_Payout_PayoutsInfoData",
        "M": "load",
        "filters": filters
      }]
    });
    return report;
  }

}

exports.default = PostAffiliatePro;
//# sourceMappingURL=postaffiliate.js.map
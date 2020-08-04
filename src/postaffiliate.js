import "@babel/polyfill/noConflict";

import axios from "axios";
import FormData from "form-data";

export default class PostAffiliatePro {
  constructor(urlServer, urlLogin, username, password, options) {
    this.urlServer = urlServer;
    this.urlLogin = urlLogin;
    this.username = username;
    this.password = password;
    this.cookies = null;
    this.session = null;
    this.options = (options) ? options : [["rememberMe", "Y"], ["language", "fr-FR"]];
  }

  async __getSession() {
    let requestSession = await axios.get(this.urlLogin);
    if (requestSession.headers && requestSession.headers["set-cookie"] && Array.isArray(requestSession.headers["set-cookie"]))
      this.session = requestSession.headers["set-cookie"][0].split(";")[0].replace("A=", "");
    return this.session;
  }

  async __authentication() {
    let bodyFormData = new FormData();
    //if (!this.session)
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

    let login = await axios({
      method: "POST",
      url: this.urlServer,
      data: bodyFormData.getBuffer(),
      headers: {
        ...bodyFormData.getHeaders()
      }
    });

    if (login && login.headers && login.headers["set-cookie"])
      this.cookies = login.headers["set-cookie"].join(";");
    let o = await this.__parseResult(login.data);
    if (o.fields && o.fields.length > 0) {
      this.session = await this.getValue(o.fields, "S");
    }

    return true;
  }

  async __getAPI(data) {
    if (!this.cookies)
      await this.__authentication();

    data.S = this.session;

    let bodyFormData = new FormData();
    bodyFormData.append("D", JSON.stringify(data));

    let response = await axios({
      method: "POST",
      url: this.urlServer,
      data: bodyFormData.getBuffer(),
      headers: {
        "Cookie": `A=${this.session}; ${this.cookies}`,
        ...bodyFormData.getHeaders()
      }
    });

    return response.data;
  }

  async __parseResult(result) {
    if (result.length > 0) {
      let returnData = [], returnFields = [], headers = [];
      if (result[0].rows || result[0].fields) {
        let rows = result[0].rows;
        let fields = (result[0].fields) ? result[0].fields : null;

        for (let key in rows) {
          if (key == 0) headers = rows[0];
          else {
            let tmpItem = {};

            for (let keyHeader in headers)
              tmpItem[headers[keyHeader]] = rows[key][keyHeader];

            returnData.push(tmpItem);
          }
        }

        if (fields) {
          for (let key in fields) {
            if (key == 0) headers = fields[0];
            else {
              let tmpItem = {};

              for (let keyHeader in headers)
                tmpItem[headers[keyHeader]] = fields[key][keyHeader];

              returnFields.push(tmpItem);
            }
          }
        }
      } else {
        let rows = result[0];
        for (let key in rows) {
          if (key == 0) headers = rows[0];
          else {
            let tmpItem = {};

            for (let keyHeader in headers)
              tmpItem[headers[keyHeader]] = rows[key][keyHeader];

            returnData.push(tmpItem);
          }
        }
      }

      return {
        data: returnData,
        fields: returnFields
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

    if (result)
      result = this.__parseResult(result);

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
    let add = await this.command({
      "C": "Gpf_Rpc_Server",
      "M": "run",
      "requests": [{
        "C": "Pap_Merchants_User_AffiliateForm",
        "M": "add",
        "fields": [["name", "value"], ["Id", ""], ["username", email], ["rpassword", password], ["firstname", firstname], ["lastname", lastname], ["customTimezone", ""], ["useCustomTimezone", "N"], ["lang", ""], ["photo", ""], ["rstatus", status], ["note", ""], ["dontSendEmail", "Y"], ["createSignupReferralComm", "N"], ["parentuserid", parentuserid], ["refid", refid], ["data1", address], ["data2", company], ["data3", street], ["data4", city], ["data5", state], ["data6", country], ["data7", postalcode], ["data8", phonenumber], ["data9", fax], ["data10", managername]]
      }]
    });
    return add;
  }

  async updateAffiliate(affiliateid, email, password, firstname, lastname, status, parentuserid, managername, refid, company, address, street, city, state, country, postalcode, phonenumber, fax) {
    let update = await this.command({
      "C": "Gpf_Rpc_Server",
      "M": "run",
      "requests": [{
        "C": "Pap_Merchants_User_AffiliateForm",
        "M": "save",
        "fields": [["name", "value"], ["Id", affiliateid], ["username", email], ["rpassword", password], ["firstname", firstname], ["lastname", lastname], ["customTimezone", ""], ["useCustomTimezone", "N"], ["lang", ""], ["photo", ""], ["rstatus", status], ["note", ""], ["dontSendEmail", "Y"], ["createSignupReferralComm", "N"], ["parentuserid", parentuserid], ["refid", refid], ["data1", address], ["data2", company], ["data3", street], ["data4", city], ["data5", state], ["data6", country], ["data7", postalcode], ["data8", phonenumber], ["data9", fax], ["data10", managername]]
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
   *
   * @param offset
   * @param limit
   * @returns {Promise<*>}
   */
  async campaigns(offset, limit) {
    let campaigns = await this.command({
      "C": "Gpf_Rpc_Server",
      "M": "run",
      "requests": [{
        "C": "Pap_Merchants_Campaign_CampaignsGrid",
        "M": "getRows",
        "offset": offset,
        "limit": limit,
        "sort_col": "rorder",
        "sort_asc": true
      }]
    });

    return campaigns.data;
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
    if (campaignid)
      filters.push(["campaignid", "E", campaignid]);
    if (affiliateid)
      filters.push(["userid", "E", affiliateid]);
    if (bannerid)
      filters.push(["bannerid", "E", bannerid]);
    if (status)
      filters.push(["rstatus", "IN", status]);

    if (datestart && dateend) {
      // 2020-07-31
      filters.push(["datetime", "D>=", datestart]);
      filters.push(["datetime", "D<=", dateend]);
    }

    //filters.push(["datetime", "DP", "L30D"]);
    let report = await this.commandResponse({
      "C": "Gpf_Rpc_Server",
      "M": "run",
      "requests": [{
        "C": "Pap_Merchants_Reports_TrafficStatsData",
        "M": "load",
        "filters": filters
      }],
    });

    return report;
  }

  /**
   *
   * @param campaignid : string|null
   * @param affiliateid : string|null
   * @param bannerid : string|null
   * @param datestart : string|null
   * @param dateend : string|null
   * @param offset : int
   * @param limit : int
   * @returns {Promise<*>}
   */
  async reportClicks(campaignid, affiliateid, bannerid, datestart, dateend, offset, limit) {
    let filters = [];
    if (campaignid)
      filters.push(["campaignid", "E", campaignid]);
    if (affiliateid)
      filters.push(["userid", "E", affiliateid]);
    if (bannerid)
      filters.push(["bannerid", "E", bannerid]);
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
        "columns": [["id"], ["id"], ["firstname"], ["lastname"], ["userid"], ["userstatus"], ["banner"], ["campaign"], ["countrycode"], ["rtype"], ["datetime"], ["referrerurl"], ["visitorid"], ["ip"], ["cdata1"], ["cdata2"]]
      }]
    });

    return clicks.data;
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
  async reportTransactions(campaignid, affiliateid, bannerid, type, datestart, dateend, offset, limit) {
    let filters = [];
    if (campaignid)
      filters.push(["campaignid", "E", campaignid]);
    if (affiliateid)
      filters.push(["userid", "E", affiliateid]);
    if (bannerid)
      filters.push(["bannerid", "E", bannerid]);
    if (type)
      filters.push(["rtype", "IN", type]); // "S,A"
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
        "columns": [["id"], ["id"], ["commission"], ["totalcost"], ["t_orderid"], ["productid"], ["dateinserted"], ["name"], ["rtype"], ["tier"], ["commissionTypeName"], ["rstatus"], ["payoutstatus"], ["firstname"], ["lastname"], ["userid"], ["userstatus"], ["actions"]]
      }]
    });

    return transactions.data;
  }

  async invoices(offset, limit) {
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
    });

    // https://arya.postaffiliatepro.com/scripts/server.php?C=Pap_Merchants_Payout_PayoutHistoryForm&M=downloadAsPdf&S=v2tanoufspjxxkwrjkp0sca5wo8u6f46&FormRequest=Y&invoiceId=lxnh7b03&FormResponse=Y
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
        }],
      }],
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
    let filters = [["rstatus", "NE", "N"]];
    if (categories)
      filters.push(["categoryid", "IN", categories]);
    if (campaignid)
      filters.push(["campaignid", "E", campaignid]);
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
        //"filters": [["rstatus", "NE", "N"], ["categoryid", "IN", "3,6"]],
        "filters": filters,
        "columns": [["id"], ["id"], ["banner"], ["rtype"], ["isconfirmed"], ["destinationurl"], ["rstatus"], ["categoryid"], ["rorder"], ["actions"]]
      }]
    });

    return banners.data;
  }
}
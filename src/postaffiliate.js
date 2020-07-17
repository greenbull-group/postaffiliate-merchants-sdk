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
      let rows = result[0].rows;
      let fields = (result[0].fields) ? result[0].fields : null;
      let returnData = [], returnFields = [], headers = [];

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

  async report(datestart, dateend, status) {
    let report = await this.command({
      "C": "Gpf_Rpc_Server",
      "M": "run",
      "requests": [{
        "C": "Pap_Affiliates_Reports_TrendsReport",
        "M": "loadData",
        "isInitRequest": "N",
        "filterType": "trends_report",
        "filters": [["datetime", "D>=", datestart], ["datetime", "D<=", dateend], ["rpc", "=", "Y"], ["groupBy", "=", "day"], ["dataType1", "=", "saleCount"], ["dataType2", "=", "saleCommission"], ["rstatus", "IN", status]]
      }],
    });

    return report.data;
  }

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
}
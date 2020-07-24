"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

require("@babel/polyfill/noConflict");

var _axios = _interopRequireDefault(require("axios"));

var _formData = _interopRequireDefault(require("form-data"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var PostAffiliatePro = /*#__PURE__*/function () {
  function PostAffiliatePro(urlServer, urlLogin, username, password, options) {
    _classCallCheck(this, PostAffiliatePro);

    this.urlServer = urlServer;
    this.urlLogin = urlLogin;
    this.username = username;
    this.password = password;
    this.cookies = null;
    this.session = null;
    this.options = options ? options : [["rememberMe", "Y"], ["language", "fr-FR"]];
  }

  _createClass(PostAffiliatePro, [{
    key: "__getSession",
    value: function () {
      var _getSession = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
        var requestSession;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return _axios["default"].get(this.urlLogin);

              case 2:
                requestSession = _context.sent;
                this.session = requestSession.headers["set-cookie"][0].split(";")[0].replace("A=", "");
                return _context.abrupt("return", this.session);

              case 5:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function __getSession() {
        return _getSession.apply(this, arguments);
      }

      return __getSession;
    }()
  }, {
    key: "__authentication",
    value: function () {
      var _authentication = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
        var bodyFormData, fields, login, o;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                bodyFormData = new _formData["default"](); //if (!this.session)
                //await this.__getSession();

                fields = [["name", "value"], ["username", this.username], ["password", this.password]];

                if (this.options) {
                  fields.push.apply(fields, _toConsumableArray(this.options));
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
                _context2.next = 6;
                return (0, _axios["default"])({
                  method: "POST",
                  url: this.urlServer,
                  data: bodyFormData.getBuffer(),
                  headers: _objectSpread({}, bodyFormData.getHeaders())
                });

              case 6:
                login = _context2.sent;
                this.cookies = login.headers["set-cookie"].join(";");
                _context2.next = 10;
                return this.__parseResult(login.data);

              case 10:
                o = _context2.sent;

                if (!(o.fields && o.fields.length > 0)) {
                  _context2.next = 15;
                  break;
                }

                _context2.next = 14;
                return this.getValue(o.fields, "S");

              case 14:
                this.session = _context2.sent;

              case 15:
                return _context2.abrupt("return", true);

              case 16:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function __authentication() {
        return _authentication.apply(this, arguments);
      }

      return __authentication;
    }()
  }, {
    key: "__getAPI",
    value: function () {
      var _getAPI = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(data) {
        var bodyFormData, response;
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                if (this.cookies) {
                  _context3.next = 3;
                  break;
                }

                _context3.next = 3;
                return this.__authentication();

              case 3:
                data.S = this.session;
                bodyFormData = new _formData["default"]();
                bodyFormData.append("D", JSON.stringify(data));
                _context3.next = 8;
                return (0, _axios["default"])({
                  method: "POST",
                  url: this.urlServer,
                  data: bodyFormData.getBuffer(),
                  headers: _objectSpread({
                    "Cookie": "A=".concat(this.session, "; ").concat(this.cookies)
                  }, bodyFormData.getHeaders())
                });

              case 8:
                response = _context3.sent;
                return _context3.abrupt("return", response.data);

              case 10:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function __getAPI(_x) {
        return _getAPI.apply(this, arguments);
      }

      return __getAPI;
    }()
  }, {
    key: "__parseResult",
    value: function () {
      var _parseResult = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(result) {
        var returnData, returnFields, headers, rows, fields, key, tmpItem, keyHeader, _key, _tmpItem, _keyHeader, _rows, _key2, _tmpItem2, _keyHeader2;

        return regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                if (!(result.length > 0)) {
                  _context4.next = 6;
                  break;
                }

                returnData = [], returnFields = [], headers = [];

                if (result[0].rows || result[0].fields) {
                  rows = result[0].rows;
                  fields = result[0].fields ? result[0].fields : null;

                  for (key in rows) {
                    if (key == 0) headers = rows[0];else {
                      tmpItem = {};

                      for (keyHeader in headers) {
                        tmpItem[headers[keyHeader]] = rows[key][keyHeader];
                      }

                      returnData.push(tmpItem);
                    }
                  }

                  if (fields) {
                    for (_key in fields) {
                      if (_key == 0) headers = fields[0];else {
                        _tmpItem = {};

                        for (_keyHeader in headers) {
                          _tmpItem[headers[_keyHeader]] = fields[_key][_keyHeader];
                        }

                        returnFields.push(_tmpItem);
                      }
                    }
                  }
                } else {
                  _rows = result[0];

                  for (_key2 in _rows) {
                    if (_key2 == 0) headers = _rows[0];else {
                      _tmpItem2 = {};

                      for (_keyHeader2 in headers) {
                        _tmpItem2[headers[_keyHeader2]] = _rows[_key2][_keyHeader2];
                      }

                      returnData.push(_tmpItem2);
                    }
                  }
                }

                return _context4.abrupt("return", {
                  data: returnData,
                  fields: returnFields
                });

              case 6:
                return _context4.abrupt("return", null);

              case 7:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4);
      }));

      function __parseResult(_x2) {
        return _parseResult.apply(this, arguments);
      }

      return __parseResult;
    }()
  }, {
    key: "getValue",
    value: function () {
      var _getValue = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(fields, key) {
        var value;
        return regeneratorRuntime.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                value = null;

                if (fields.length > 0) {
                  fields.forEach(function (field) {
                    if (field.name === key && field.value) {
                      value = field.value;
                    }
                  });
                }

                return _context5.abrupt("return", value);

              case 3:
              case "end":
                return _context5.stop();
            }
          }
        }, _callee5);
      }));

      function getValue(_x3, _x4) {
        return _getValue.apply(this, arguments);
      }

      return getValue;
    }()
  }, {
    key: "command",
    value: function () {
      var _command = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6(data) {
        var result;
        return regeneratorRuntime.wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                _context6.next = 2;
                return this.__getAPI(data);

              case 2:
                result = _context6.sent;
                if (result) result = this.__parseResult(result);
                return _context6.abrupt("return", result);

              case 5:
              case "end":
                return _context6.stop();
            }
          }
        }, _callee6, this);
      }));

      function command(_x5) {
        return _command.apply(this, arguments);
      }

      return command;
    }()
  }, {
    key: "commandResponse",
    value: function () {
      var _commandResponse = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7(data) {
        return regeneratorRuntime.wrap(function _callee7$(_context7) {
          while (1) {
            switch (_context7.prev = _context7.next) {
              case 0:
                _context7.next = 2;
                return this.__getAPI(data);

              case 2:
                return _context7.abrupt("return", _context7.sent);

              case 3:
              case "end":
                return _context7.stop();
            }
          }
        }, _callee7, this);
      }));

      function commandResponse(_x6) {
        return _commandResponse.apply(this, arguments);
      }

      return commandResponse;
    }()
    /**
     *
     * @param offset
     * @param limit
     * @returns {Promise<*>}
     */

  }, {
    key: "affiliatesInCampaigns",
    value: function () {
      var _affiliatesInCampaigns = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee8(offset, limit) {
        var campaigns;
        return regeneratorRuntime.wrap(function _callee8$(_context8) {
          while (1) {
            switch (_context8.prev = _context8.next) {
              case 0:
                _context8.next = 2;
                return this.command({
                  "C": "Gpf_Rpc_Server",
                  "M": "run",
                  "requests": [{
                    "C": "Pap_Features_Common_AffiliateCampaignsGrid",
                    "M": "getRows",
                    "offset": offset,
                    "limit": limit
                  }]
                });

              case 2:
                campaigns = _context8.sent;
                return _context8.abrupt("return", campaigns.data);

              case 4:
              case "end":
                return _context8.stop();
            }
          }
        }, _callee8, this);
      }));

      function affiliatesInCampaigns(_x7, _x8) {
        return _affiliatesInCampaigns.apply(this, arguments);
      }

      return affiliatesInCampaigns;
    }()
    /**
     *
     * @param offset
     * @param limit
     * @returns {Promise<*>}
     */

  }, {
    key: "affiliates",
    value: function () {
      var _affiliates = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee9(offset, limit) {
        var affiliates;
        return regeneratorRuntime.wrap(function _callee9$(_context9) {
          while (1) {
            switch (_context9.prev = _context9.next) {
              case 0:
                _context9.next = 2;
                return this.command({
                  "C": "Gpf_Rpc_Server",
                  "M": "run",
                  "requests": [{
                    "C": "Pap_Merchants_User_TopAffiliatesGrid",
                    "M": "getRows",
                    "offset": offset,
                    "limit": limit
                  }]
                });

              case 2:
                affiliates = _context9.sent;
                return _context9.abrupt("return", affiliates.data);

              case 4:
              case "end":
                return _context9.stop();
            }
          }
        }, _callee9, this);
      }));

      function affiliates(_x9, _x10) {
        return _affiliates.apply(this, arguments);
      }

      return affiliates;
    }()
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

  }, {
    key: "addAffiliate",
    value: function () {
      var _addAffiliate = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee10(email, password, firstname, lastname, status, parentuserid, managername, refid, company, address, street, city, state, country, postalcode, phonenumber, fax) {
        var add;
        return regeneratorRuntime.wrap(function _callee10$(_context10) {
          while (1) {
            switch (_context10.prev = _context10.next) {
              case 0:
                _context10.next = 2;
                return this.command({
                  "C": "Gpf_Rpc_Server",
                  "M": "run",
                  "requests": [{
                    "C": "Pap_Merchants_User_AffiliateForm",
                    "M": "add",
                    "fields": [["name", "value"], ["Id", ""], ["username", email], ["rpassword", password], ["firstname", firstname], ["lastname", lastname], ["customTimezone", ""], ["useCustomTimezone", "N"], ["lang", ""], ["photo", ""], ["rstatus", status], ["note", ""], ["dontSendEmail", "Y"], ["createSignupReferralComm", "N"], ["parentuserid", parentuserid], ["refid", refid], ["data1", address], ["data2", company], ["data3", street], ["data4", city], ["data5", state], ["data6", country], ["data7", postalcode], ["data8", phonenumber], ["data9", fax], ["data10", managername]]
                  }]
                });

              case 2:
                add = _context10.sent;
                return _context10.abrupt("return", add);

              case 4:
              case "end":
                return _context10.stop();
            }
          }
        }, _callee10, this);
      }));

      function addAffiliate(_x11, _x12, _x13, _x14, _x15, _x16, _x17, _x18, _x19, _x20, _x21, _x22, _x23, _x24, _x25, _x26, _x27) {
        return _addAffiliate.apply(this, arguments);
      }

      return addAffiliate;
    }()
  }, {
    key: "updateAffiliate",
    value: function () {
      var _updateAffiliate = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee11(affiliateid, email, password, firstname, lastname, status, parentuserid, managername, refid, company, address, street, city, state, country, postalcode, phonenumber, fax) {
        var update;
        return regeneratorRuntime.wrap(function _callee11$(_context11) {
          while (1) {
            switch (_context11.prev = _context11.next) {
              case 0:
                _context11.next = 2;
                return this.command({
                  "C": "Gpf_Rpc_Server",
                  "M": "run",
                  "requests": [{
                    "C": "Pap_Merchants_User_AffiliateForm",
                    "M": "save",
                    "fields": [["name", "value"], ["Id", affiliateid], ["username", email], ["rpassword", password], ["firstname", firstname], ["lastname", lastname], ["customTimezone", ""], ["useCustomTimezone", "N"], ["lang", ""], ["photo", ""], ["rstatus", status], ["note", ""], ["dontSendEmail", "Y"], ["createSignupReferralComm", "N"], ["parentuserid", parentuserid], ["refid", refid], ["data1", address], ["data2", company], ["data3", street], ["data4", city], ["data5", state], ["data6", country], ["data7", postalcode], ["data8", phonenumber], ["data9", fax], ["data10", managername]]
                  }]
                });

              case 2:
                update = _context11.sent;
                return _context11.abrupt("return", update);

              case 4:
              case "end":
                return _context11.stop();
            }
          }
        }, _callee11, this);
      }));

      function updateAffiliate(_x28, _x29, _x30, _x31, _x32, _x33, _x34, _x35, _x36, _x37, _x38, _x39, _x40, _x41, _x42, _x43, _x44, _x45) {
        return _updateAffiliate.apply(this, arguments);
      }

      return updateAffiliate;
    }()
    /**
     *
     * @param status : A|D|P
     * @param ids : [string]
     * @returns {Promise<*>}
     */

  }, {
    key: "changeStatusAffiliate",
    value: function () {
      var _changeStatusAffiliate = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee12(status, ids) {
        var change;
        return regeneratorRuntime.wrap(function _callee12$(_context12) {
          while (1) {
            switch (_context12.prev = _context12.next) {
              case 0:
                _context12.next = 2;
                return this.command({
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

              case 2:
                change = _context12.sent;
                return _context12.abrupt("return", change);

              case 4:
              case "end":
                return _context12.stop();
            }
          }
        }, _callee12, this);
      }));

      function changeStatusAffiliate(_x46, _x47) {
        return _changeStatusAffiliate.apply(this, arguments);
      }

      return changeStatusAffiliate;
    }()
    /**
     * @param ids : [string]
     * @returns {Promise<*>}
     */

  }, {
    key: "deleteAffiliate",
    value: function () {
      var _deleteAffiliate = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee13(ids) {
        var deleted;
        return regeneratorRuntime.wrap(function _callee13$(_context13) {
          while (1) {
            switch (_context13.prev = _context13.next) {
              case 0:
                _context13.next = 2;
                return this.command({
                  "C": "Gpf_Rpc_Server",
                  "M": "run",
                  "requests": [{
                    "C": "Pap_Merchants_User_AffiliateForm",
                    "M": "deleteRows",
                    "moveChildAffiliates": "N",
                    "ids": ids
                  }]
                });

              case 2:
                deleted = _context13.sent;
                return _context13.abrupt("return", deleted);

              case 4:
              case "end":
                return _context13.stop();
            }
          }
        }, _callee13, this);
      }));

      function deleteAffiliate(_x48) {
        return _deleteAffiliate.apply(this, arguments);
      }

      return deleteAffiliate;
    }()
    /**
     *
     * @param offset
     * @param limit
     * @returns {Promise<*>}
     */

  }, {
    key: "campaigns",
    value: function () {
      var _campaigns = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee14(offset, limit) {
        var campaigns;
        return regeneratorRuntime.wrap(function _callee14$(_context14) {
          while (1) {
            switch (_context14.prev = _context14.next) {
              case 0:
                _context14.next = 2;
                return this.command({
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

              case 2:
                campaigns = _context14.sent;
                return _context14.abrupt("return", campaigns.data);

              case 4:
              case "end":
                return _context14.stop();
            }
          }
        }, _callee14, this);
      }));

      function campaigns(_x49, _x50) {
        return _campaigns.apply(this, arguments);
      }

      return campaigns;
    }()
    /**
     *
     * @param filters : []
     * @returns {Promise<*>}
     */

  }, {
    key: "campaignsInfos",
    value: function () {
      var _campaignsInfos = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee15(filters) {
        var infos;
        return regeneratorRuntime.wrap(function _callee15$(_context15) {
          while (1) {
            switch (_context15.prev = _context15.next) {
              case 0:
                _context15.next = 2;
                return this.command({
                  "C": "Gpf_Rpc_Server",
                  "M": "run",
                  "requests": [{
                    "C": "Pap_Merchants_Campaign_CampaignsInfoData",
                    "M": "load",
                    //"filters": [["dateinserted","DP","TM"]]
                    "filters": filters
                  }]
                });

              case 2:
                infos = _context15.sent;
                return _context15.abrupt("return", infos.data);

              case 4:
              case "end":
                return _context15.stop();
            }
          }
        }, _callee15, this);
      }));

      function campaignsInfos(_x51) {
        return _campaignsInfos.apply(this, arguments);
      }

      return campaignsInfos;
    }()
    /**
     *
     * @param categoryid
     * @param offset
     * @param limit
     * @returns {Promise<*>}
     */

  }, {
    key: "promo",
    value: function () {
      var _promo = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee16(categoryid, offset, limit) {
        var coupons;
        return regeneratorRuntime.wrap(function _callee16$(_context16) {
          while (1) {
            switch (_context16.prev = _context16.next) {
              case 0:
                _context16.next = 2;
                return this.command({
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

              case 2:
                coupons = _context16.sent;
                return _context16.abrupt("return", coupons.data);

              case 4:
              case "end":
                return _context16.stop();
            }
          }
        }, _callee16, this);
      }));

      function promo(_x52, _x53, _x54) {
        return _promo.apply(this, arguments);
      }

      return promo;
    }()
    /**
     *
     * @param campaignid : string|null
     * @param affiliateid : string|null
     * @param bannerid : string|null
     * @returns {Promise<*>}
     */

  }, {
    key: "report",
    value: function () {
      var _report = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee17(campaignid, affiliateid, bannerid, status, datestart, dateend) {
        var filters, report;
        return regeneratorRuntime.wrap(function _callee17$(_context17) {
          while (1) {
            switch (_context17.prev = _context17.next) {
              case 0:
                filters = [];
                if (campaignid) filters.push(["campaignid", "E", campaignid]);
                if (affiliateid) filters.push(["userid", "E", affiliateid]);
                if (bannerid) filters.push(["bannerid", "E", bannerid]);
                if (status) filters.push(["rstatus", "IN", status]);

                if (datestart && dateend) {
                  // 2020-07-31
                  filters.push(["datetime", "D>=", datestart]);
                  filters.push(["datetime", "D<=", dateend]);
                } //filters.push(["datetime", "DP", "L30D"]);


                _context17.next = 8;
                return this.commandResponse({
                  "C": "Gpf_Rpc_Server",
                  "M": "run",
                  "requests": [{
                    "C": "Pap_Merchants_Reports_TrafficStatsData",
                    "M": "load",
                    "filters": filters
                  }]
                });

              case 8:
                report = _context17.sent;
                return _context17.abrupt("return", report);

              case 10:
              case "end":
                return _context17.stop();
            }
          }
        }, _callee17, this);
      }));

      function report(_x55, _x56, _x57, _x58, _x59, _x60) {
        return _report.apply(this, arguments);
      }

      return report;
    }()
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

  }, {
    key: "reportClicks",
    value: function () {
      var _reportClicks = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee18(campaignid, affiliateid, bannerid, datestart, dateend, offset, limit) {
        var filters, clicks;
        return regeneratorRuntime.wrap(function _callee18$(_context18) {
          while (1) {
            switch (_context18.prev = _context18.next) {
              case 0:
                filters = [];
                if (campaignid) filters.push(["campaignid", "E", campaignid]);
                if (affiliateid) filters.push(["userid", "E", affiliateid]);
                if (bannerid) filters.push(["bannerid", "E", bannerid]);

                if (datestart && dateend) {
                  // 2020-07-31
                  filters.push(["datetime", "D>=", datestart]);
                  filters.push(["datetime", "D<=", dateend]);
                }

                _context18.next = 7;
                return this.command({
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

              case 7:
                clicks = _context18.sent;
                return _context18.abrupt("return", clicks.data);

              case 9:
              case "end":
                return _context18.stop();
            }
          }
        }, _callee18, this);
      }));

      function reportClicks(_x61, _x62, _x63, _x64, _x65, _x66, _x67) {
        return _reportClicks.apply(this, arguments);
      }

      return reportClicks;
    }()
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

  }, {
    key: "reportTransactions",
    value: function () {
      var _reportTransactions = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee19(campaignid, affiliateid, bannerid, type, datestart, dateend, offset, limit) {
        var filters, transactions;
        return regeneratorRuntime.wrap(function _callee19$(_context19) {
          while (1) {
            switch (_context19.prev = _context19.next) {
              case 0:
                filters = [];
                if (campaignid) filters.push(["campaignid", "E", campaignid]);
                if (affiliateid) filters.push(["userid", "E", affiliateid]);
                if (bannerid) filters.push(["bannerid", "E", bannerid]);
                if (type) filters.push(["rtype", "IN", type]); // "S,A"

                if (datestart && dateend) {
                  // 2020-07-31
                  filters.push(["dateinserted", "D>=", datestart]);
                  filters.push(["dateinserted", "D<=", dateend]);
                }

                _context19.next = 8;
                return this.command({
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

              case 8:
                transactions = _context19.sent;
                return _context19.abrupt("return", transactions.data);

              case 10:
              case "end":
                return _context19.stop();
            }
          }
        }, _callee19, this);
      }));

      function reportTransactions(_x68, _x69, _x70, _x71, _x72, _x73, _x74, _x75) {
        return _reportTransactions.apply(this, arguments);
      }

      return reportTransactions;
    }()
  }, {
    key: "invoices",
    value: function () {
      var _invoices = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee20(offset, limit) {
        var invoices;
        return regeneratorRuntime.wrap(function _callee20$(_context20) {
          while (1) {
            switch (_context20.prev = _context20.next) {
              case 0:
                _context20.next = 2;
                return this.command({
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

              case 2:
                invoices = _context20.sent;
                return _context20.abrupt("return", invoices);

              case 4:
              case "end":
                return _context20.stop();
            }
          }
        }, _callee20, this);
      }));

      function invoices(_x76, _x77) {
        return _invoices.apply(this, arguments);
      }

      return invoices;
    }()
  }, {
    key: "downloadInvoice",
    value: function () {
      var _downloadInvoice = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee21(invoiceid) {
        var invoice;
        return regeneratorRuntime.wrap(function _callee21$(_context21) {
          while (1) {
            switch (_context21.prev = _context21.next) {
              case 0:
                _context21.next = 2;
                return this.commandResponse({
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

              case 2:
                invoice = _context21.sent;
                return _context21.abrupt("return", invoice);

              case 4:
              case "end":
                return _context21.stop();
            }
          }
        }, _callee21, this);
      }));

      function downloadInvoice(_x78) {
        return _downloadInvoice.apply(this, arguments);
      }

      return downloadInvoice;
    }()
    /**
     *
     * @param url
     * @param campaignid
     * @returns {Promise<*>}
     */

  }, {
    key: "deeplink",
    value: function () {
      var _deeplink = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee22(url, campaignid) {
        var deeplink;
        return regeneratorRuntime.wrap(function _callee22$(_context22) {
          while (1) {
            switch (_context22.prev = _context22.next) {
              case 0:
                _context22.next = 2;
                return this.command({
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

              case 2:
                deeplink = _context22.sent;
                return _context22.abrupt("return", deeplink.fields[2].value);

              case 4:
              case "end":
                return _context22.stop();
            }
          }
        }, _callee22, this);
      }));

      function deeplink(_x79, _x80) {
        return _deeplink.apply(this, arguments);
      }

      return deeplink;
    }()
    /**
     * @param campaignid : int|null
     * @param categories : string|null
     * @param offset : int
     * @param limit : int
     * @returns {Promise<void>}
     */

  }, {
    key: "banners",
    value: function () {
      var _banners = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee23(campaignid, categories, offset, limit) {
        var filters, banners;
        return regeneratorRuntime.wrap(function _callee23$(_context23) {
          while (1) {
            switch (_context23.prev = _context23.next) {
              case 0:
                filters = [["rstatus", "NE", "N"]];
                if (categories) filters.push(["categoryid", "IN", categories]);
                if (campaignid) filters.push(["campaignid", "E", campaignid]);
                _context23.next = 5;
                return this.command({
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

              case 5:
                banners = _context23.sent;
                return _context23.abrupt("return", banners.data);

              case 7:
              case "end":
                return _context23.stop();
            }
          }
        }, _callee23, this);
      }));

      function banners(_x81, _x82, _x83, _x84) {
        return _banners.apply(this, arguments);
      }

      return banners;
    }()
  }]);

  return PostAffiliatePro;
}();

exports["default"] = PostAffiliatePro;
//# sourceMappingURL=postaffiliate.js.map
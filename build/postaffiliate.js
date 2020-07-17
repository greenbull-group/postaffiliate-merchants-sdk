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
        var rows, fields, returnData, returnFields, headers, key, tmpItem, keyHeader, _key, _tmpItem, _keyHeader;

        return regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                if (!(result.length > 0)) {
                  _context4.next = 9;
                  break;
                }

                rows = result[0].rows;
                fields = result[0].fields ? result[0].fields : null;
                returnData = [], returnFields = [], headers = [];

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

                return _context4.abrupt("return", {
                  data: returnData,
                  fields: returnFields
                });

              case 9:
                return _context4.abrupt("return", null);

              case 10:
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
    key: "affiliatesInCampaigns",
    value: function () {
      var _affiliatesInCampaigns = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7(offset, limit) {
        var campaigns;
        return regeneratorRuntime.wrap(function _callee7$(_context7) {
          while (1) {
            switch (_context7.prev = _context7.next) {
              case 0:
                _context7.next = 2;
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
                campaigns = _context7.sent;
                return _context7.abrupt("return", campaigns.data);

              case 4:
              case "end":
                return _context7.stop();
            }
          }
        }, _callee7, this);
      }));

      function affiliatesInCampaigns(_x6, _x7) {
        return _affiliatesInCampaigns.apply(this, arguments);
      }

      return affiliatesInCampaigns;
    }()
  }, {
    key: "affiliates",
    value: function () {
      var _affiliates = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee8(offset, limit) {
        var affiliates;
        return regeneratorRuntime.wrap(function _callee8$(_context8) {
          while (1) {
            switch (_context8.prev = _context8.next) {
              case 0:
                _context8.next = 2;
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
                affiliates = _context8.sent;
                return _context8.abrupt("return", affiliates.data);

              case 4:
              case "end":
                return _context8.stop();
            }
          }
        }, _callee8, this);
      }));

      function affiliates(_x8, _x9) {
        return _affiliates.apply(this, arguments);
      }

      return affiliates;
    }()
  }, {
    key: "campaigns",
    value: function () {
      var _campaigns = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee9(offset, limit) {
        var campaigns;
        return regeneratorRuntime.wrap(function _callee9$(_context9) {
          while (1) {
            switch (_context9.prev = _context9.next) {
              case 0:
                _context9.next = 2;
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
                campaigns = _context9.sent;
                return _context9.abrupt("return", campaigns.data);

              case 4:
              case "end":
                return _context9.stop();
            }
          }
        }, _callee9, this);
      }));

      function campaigns(_x10, _x11) {
        return _campaigns.apply(this, arguments);
      }

      return campaigns;
    }()
  }, {
    key: "promo",
    value: function () {
      var _promo = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee10(categoryid, offset, limit) {
        var coupons;
        return regeneratorRuntime.wrap(function _callee10$(_context10) {
          while (1) {
            switch (_context10.prev = _context10.next) {
              case 0:
                _context10.next = 2;
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
                coupons = _context10.sent;
                return _context10.abrupt("return", coupons.data);

              case 4:
              case "end":
                return _context10.stop();
            }
          }
        }, _callee10, this);
      }));

      function promo(_x12, _x13, _x14) {
        return _promo.apply(this, arguments);
      }

      return promo;
    }()
  }, {
    key: "report",
    value: function () {
      var _report = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee11(datestart, dateend, status) {
        var report;
        return regeneratorRuntime.wrap(function _callee11$(_context11) {
          while (1) {
            switch (_context11.prev = _context11.next) {
              case 0:
                _context11.next = 2;
                return this.command({
                  "C": "Gpf_Rpc_Server",
                  "M": "run",
                  "requests": [{
                    "C": "Pap_Affiliates_Reports_TrendsReport",
                    "M": "loadData",
                    "isInitRequest": "N",
                    "filterType": "trends_report",
                    "filters": [["datetime", "D>=", datestart], ["datetime", "D<=", dateend], ["rpc", "=", "Y"], ["groupBy", "=", "day"], ["dataType1", "=", "saleCount"], ["dataType2", "=", "saleCommission"], ["rstatus", "IN", status]]
                  }]
                });

              case 2:
                report = _context11.sent;
                return _context11.abrupt("return", report.data);

              case 4:
              case "end":
                return _context11.stop();
            }
          }
        }, _callee11, this);
      }));

      function report(_x15, _x16, _x17) {
        return _report.apply(this, arguments);
      }

      return report;
    }()
  }, {
    key: "deeplink",
    value: function () {
      var _deeplink = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee12(url, campaignid) {
        var deeplink;
        return regeneratorRuntime.wrap(function _callee12$(_context12) {
          while (1) {
            switch (_context12.prev = _context12.next) {
              case 0:
                _context12.next = 2;
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
                deeplink = _context12.sent;
                return _context12.abrupt("return", deeplink.fields[2].value);

              case 4:
              case "end":
                return _context12.stop();
            }
          }
        }, _callee12, this);
      }));

      function deeplink(_x18, _x19) {
        return _deeplink.apply(this, arguments);
      }

      return deeplink;
    }()
  }]);

  return PostAffiliatePro;
}();

exports["default"] = PostAffiliatePro;
//# sourceMappingURL=postaffiliate.js.map
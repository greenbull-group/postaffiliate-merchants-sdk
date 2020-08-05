"use strict";

var _postaffiliate = _interopRequireDefault(require("./postaffiliate"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const postaffiliatepro = new _postaffiliate.default("http://demo.postaffiliatepro.com/scripts/server.php", "http://demo.postaffiliatepro.com/merchants/login.php", "username", "password", [["roleType", "M"], ["language", "fr-FR"], ["isFromApi", "Y"], ["apiVersion", "5.9.19.3"]]);

(async () => {
  //Affiliates
  let affiliates = await postaffiliatepro.affiliates(0, 100);
  console.log(affiliates); // eslint-disable-line
})();
//# sourceMappingURL=sample.js.map
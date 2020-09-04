const postaffiliate = require("./index");

postaffiliate.setUrlServer("http://demo.postaffiliatepro.com/scripts/server.php");
postaffiliate.setUrlLogin("http://demo.postaffiliatepro.com/merchants/login.php");
postaffiliate.setUsername("username");
postaffiliate.setPassword("password");
postaffiliate.setOptions([["roleType", "M"], ["language", "fr-FR"], ["isFromApi", "Y"], ["apiVersion", "5.9.19.3"]]);

(async () => {
  //Affiliates
  let affiliates = await postaffiliate.affiliates(0, 100);
  console.log(affiliates); // eslint-disable-line
})();
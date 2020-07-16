import PostAffiliatePro from "./postaffiliate";

const postaffiliatepro = new PostAffiliatePro("http://demo.postaffiliatepro.com/scripts/server.php", "http://demo.postaffiliatepro.com/merchants/login.php", "username", "password", [["roleType", "M"], ["language", "fr-FR"], ["isFromApi", "Y"], ["apiVersion", "5.9.19.3"]]);

(async () => {
  //Affiliates
  let affiliates = await postaffiliatepro.affiliates(0, 100);
  console.log(affiliates); // eslint-disable-line

})();
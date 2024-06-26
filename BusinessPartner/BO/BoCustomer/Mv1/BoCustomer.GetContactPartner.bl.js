"use strict";

///////////////////////////////////////////////////////////////////////////////////////////////
//                 IMPORTANT - DO NOT MODIFY AUTO-GENERATED CODE OR COMMENTS                 //
//Parts of this file are auto-generated and modifications to those sections will be          //
//overwritten. You are allowed to modify:                                                    //
// - the tags in the jsDoc as described in the corresponding section                         //
// - the function name and its parameters                                                    //
// - the function body between the insertion ranges                                          //
//         "Add your customizing javaScript code below / above"                              //
//                                                                                           //
// NOTE:                                                                                     //
// - If you have created PRE and POST functions, they will be executed in the same order     //
//   as before.                                                                              //
// - If you have created a REPLACE to override core function, only the REPLACE function will //
//   be executed. PRE and POST functions will be executed in the same order as before.       //
//                                                                                           //
// - For new customizations, you can directly modify this file. There is no need to use the  //
//   PRE, POST, and REPLACE functions.                                                       //
//                                                                                           //
///////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Use the following jsDoc tags to describe the BL function. Setting these tags will
 * change the runtime behavior in the mobile app. The values specified in the tags determine
 * the name of the contract file. The filename format is “@this . @function .bl.js”.
 * For example, LoVisit.BeforeLoadAsync.bl.js
 * -> function: Name of the businessLogic function.
 * -> this: The LO, BO, or LU object that this function belongs to (and it is part of the filename).
 * -> kind: Type of object this function belongs to. Most common value is "businessobject".
 * -> async: If declared as async then the function should return a promise.
 * -> param: List of parameters the function accepts. Make sure the parameters match the function signature.
 * -> module: Use CORE or CUSTOM. If you are a Salesforce client or an implementation partner, always use CUSTOM to enable a seamless release upgrade.
 * -> maxRuntime: Maximum time this function is allowed to run, takes integer value in ms. If the max time is exceeded, error is logged.
 * -> returns: Type and variable name in which the return value is stored.
 * @function getContactPartner
 * @this BoCustomer
 * @kind businessobject
 * @async
 * @namespace CORE
 * @returns promise
 */
function getContactPartner(){
    var me = this;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code below.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////
    
var attachments;
var loadAttachments = function (jsonQuery) {
  return BoFactory.loadObjectByParamsAsync("LoBpaAttachment", jsonQuery).then(
    function (loBpaAttachment) {
      if (Utils.isDefined(loBpaAttachment)) {
        attachments = [];
        if (loBpaAttachment.getCount() > 0) {
          attachments = loBpaAttachment.getAllItems();
        }
      }    
    });
};

var contactPartners = me.getLoContactPartner().getAllItems();
var contactPartnerCount = contactPartners.length;
var customerContactInfo = {};
var name = "";
var mainFunction = "";
var phone = "";
var mobile = "";
var count = 0;
var visible = false;
var contactPartnerPKey = "";
var customerPKey = me.getPKey();
var customerParams = [];
var customerQuery = {};
var contactParams = [];
var contactQuery = {};
var addCond = "";

//Check if Store Manager is available. If not, then take the first contact partner

if (contactPartnerCount > 0) {
  for (var i = 0; i < contactPartnerCount; i++) {
    if (contactPartners[i].mainFunction === "StoreManager") {
      name = contactPartners[i].name;
      mainFunction = "StoreManager";
      phone = contactPartners[i].phone1;
      mobile = contactPartners[i].phone2;
      contactPartnerPKey = contactPartners[i].getToPKey();
      visible = true;
      count = 1;
      break;
    }
  }

  if (count !== 1) {
    name = contactPartners[0].name;							
    mainFunction = contactPartners[0].mainFunction;
    phone = contactPartners[0].phone1;
    mobile = contactPartners[0].phone2;
    contactPartnerPKey = contactPartners[0].getToPKey();
    visible = true;
  }
}

customerContactInfo.name = name;
customerContactInfo.mainFunction = Utils.getToggleText("DomBpaFunction", mainFunction);
customerContactInfo.phone = phone;
customerContactInfo.mobile = mobile;
customerContactInfo.visible = visible;

// Get first found image maintained for customer and associated contact partner with usage Icon

if(Utils.isSfBackend()){
  addCond = "AND SF_File.Usage__c = 'Icon' ";
}
else {
  addCond = "AND BpaAttachment.Usage = 'Picture' "; 
}

customerParams.push({ "field": "addCond", "value": addCond });
customerParams.push({ "field": "referencePKey", "value": customerPKey });
customerQuery.params = customerParams;

if (contactPartnerCount > 0) {
  contactParams.push({ "field": "addCond", "value": addCond });
  contactParams.push({ "field": "referencePKey", "value": contactPartnerPKey });
  contactQuery.params = contactParams;
}

var promise = loadAttachments(customerQuery).then(
  function() {
    if(attachments.length > 0) {
      customerContactInfo.customerProfilePicture = attachments[0].getMediaPath();
      customerContactInfo.customerPictureFileType = attachments[0].getType();
    }
    return contactPartnerCount > 0 ? loadAttachments(contactQuery) : customerContactInfo;
  }).then(
  function() {
    if(attachments.length > 0 && contactPartnerCount > 0) {
      customerContactInfo.contactProfilePicture = attachments[0].getMediaPath();
      customerContactInfo.contactPictureFileType = attachments[0].getType();
    }
    return customerContactInfo;
  });

    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code above.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    return promise;
}
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
 * @function getOverdueCustomersforCard
 * @this LoOverdueCustomers
 * @kind listobject
 * @async
 * @namespace CORE
 * @param {String} cardDate
 * @returns promise
 */
function getOverdueCustomersforCard(cardDate){
    var me = this;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code below.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////
    
///Double conversion is needed  here as no Utils Function is available to replace
//returns Date with TimeStamp
var jsonQuery = {
  "cardDate" : Utils.isCasBackend() ? Utils.convertDateTime2Ansi(Utils.convertAnsiDate2Date(cardDate)) : cardDate ,
  "limitDueToFormFactor" : Utils.isPhone() ? 3 : 5
};

if (Utils.isSfBackend()) {
  jsonQuery.addCond_LeadTimeFollowUpTime = " ((SubBpaRelValidFrom <= #cardDate# AND SubBpaRelValidThru >= #cardDate#) OR Account_Manager__c.Id IS NOT NULL ) AND ";
}
else {
  jsonQuery.addCond_LeadTimeFollowUpTime = " (((DATETIME (SubBpaRelValidFrom) <= #cardDate# AND DATETIME (SubBpaRelValidThru) >= #cardDate#)) OR BpaManagement.Pkey IS NOT NULL ) AND ";
}
me.removeAllItems();

var promise = Facade.getListAsync("LoOverdueCustomers", jsonQuery).then(
  function(listObject) {

var length = listObject.length;

for(var i=0; i<length; i++){

  if (listObject[i].jdlCount != '0' && listObject[i].promotionCount != '0'){
    listObject[i].overdueImage = "Overdue_Promo_Activities";
  }
  else if (listObject[i].jdlCount != '0' && listObject[i].promotionCount == '0'){
    listObject[i].overdueImage = "OverdueActivities";
  }
  else if (listObject[i].jdlCount == '0' && listObject[i].promotionCount != '0'){
    listObject[i].overdueImage = "OverduePromotion";
  }
  else if (listObject[i].jdlCount == '0' && listObject[i].promotionCount == '0'){
    listObject[i].overdueImage = "Overdue";
  }
}
   me.cardItemCount = length;
    me.addItems(listObject);

    return me;
  }
);

    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code above.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    return promise;
}
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
 * @function refreshSalesCockpitData
 * @this BoSalesCockpitHelper
 * @kind businessobject
 * @namespace CORE
 * @param {DomDate} cardDate
 * @returns me
 */
function refreshSalesCockpitData(cardDate){
    var me = this;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code below.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////
    
var dateText = " ";

if(me.dsdMode == "1") {
  dateText = Localization.localize(Utils.createDateNow(), "date", "dddd, MMMM D");
}

me.setCardUserWelcome_DateText(dateText);

var isTourUser = ApplicationContext.get('user').hasRole('TourUser');
me.setIsTourUser(isTourUser);

var cardVisits_emptyMainMessage = "";
var cardVisits_emptySubMessage = "";

var cardTasks_emptyMainMessage = "";
var cardTasks_emptySubMessage = "";

var cardCustomerTasks_emptyMainMessage = "";
var cardCustomerTasks_emptySubMessage = "";

var cardCustomersOverdue_emptyMainMessage = "";

if(me.dsdMode == "1") {
  cardVisits_emptyMainMessage = Localization.resolve("CardVisits_NoDataMessageMainTourText");
}
else if(Utils.createAnsiDateToday() == cardDate) {
  cardVisits_emptyMainMessage = Localization.resolve("CardVisits_NoDataMessageMainText");
  cardVisits_emptySubMessage = Localization.resolve("CardVisits_NoDataMessageSubText");

  cardTasks_emptyMainMessage = Localization.resolve("CardTasks_NoDataMessageMainText");
  cardTasks_emptySubMessage = Localization.resolve("CardTasks_NoDataMessageSubText");

  cardCustomerTasks_emptyMainMessage = Localization.resolve("CardTasks_NoDataMessageMainText");
  cardCustomerTasks_emptySubMessage = Localization.resolve("CardTasks_NoDataMessageSubText");
}
else {
  cardVisits_emptyMainMessage = Localization.resolve("CardVisits_NoDataMessageMainDateText");
  cardVisits_emptySubMessage = Localization.resolve("CardVisits_NoDataMessageSubText");

  cardTasks_emptyMainMessage = Localization.resolve("CardTasks_NoDataMessageMainDateText");
  cardTasks_emptySubMessage = Localization.resolve("CardTasks_NoDataMessageMainDateSubText");

  cardCustomerTasks_emptyMainMessage = Localization.resolve("CardTasks_NoDataMessageMainDateText");
  cardCustomerTasks_emptySubMessage = Localization.resolve("CardTasks_NoDataMessageMainDateSubText");
}

cardCustomersOverdue_emptyMainMessage = Localization.resolve("CardCustomersOverdue_NoDataMessageMainText");

me.setCardVisits_emptyMainMessage(cardVisits_emptyMainMessage);
me.setCardVisits_emptySubMessage(cardVisits_emptySubMessage);

me.setCardTasks_emptyMainMessage(cardTasks_emptyMainMessage);
me.setCardTasks_emptySubMessage(cardTasks_emptySubMessage);

me.setCardCustomerTasks_emptyMainMessage(cardCustomerTasks_emptyMainMessage);
me.setCardCustomerTasks_emptySubMessage(cardCustomerTasks_emptySubMessage);

me.setCardCustomersOverdue_emptyMainMessage(cardCustomersOverdue_emptyMainMessage);

    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code above.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    return me;
}
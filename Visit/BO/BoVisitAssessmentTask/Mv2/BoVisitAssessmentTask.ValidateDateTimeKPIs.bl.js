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
 * @function validateDateTimeKPIs
 * @this BoVisitAssessmentTask
 * @kind businessobject
 * @namespace CORE
 * @param {Object} messageCollector
 */
function validateDateTimeKPIs(messageCollector){
    var me = this;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code below.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////
    
//select all time parts
//if time part is not empty date part must be filled and not equal minDate
var timeKPIsToCheck = me.getLoRetailVisitKPI().getItemsByParamArray([{"dataType" : "NullableString", "op" : "EQ"}, {"aidDataType" : "DateTime", "op" : "EQ"}]);

var invalidDateTimeKPIs = [];
timeKPIsToCheck.forEach(function(timeKPI){
  if(Utils.isDefined(timeKPI.getActualValue())){
    var datePart = me.getLoRetailVisitKPI().getItemsByParam({ "linkedRecordId" : timeKPI.getPKey() });
    if(datePart.length === 0 || !Utils.isDefined(datePart[0].getActualValue())){
      invalidDateTimeKPIs.push(timeKPI.getQuestion() +  " " + Localization.resolve("BoVisitAssessmentTask_TimeFormatValidationFor") + " " + timeKPI.getProductName() );
    }
  }

});

//select all date parts 
//if date part is not min date time part must exist and must be filled
var dateKPIsToCheck = me.getLoRetailVisitKPI().getItemsByParamArray([{"dataType" : "NullableDate", "op" : "EQ"}, {"aidDataType" : "DateTime", "op" : "EQ"}]);

dateKPIsToCheck.forEach(function(dateKPI){
  if(Utils.isDefined(dateKPI.getActualValue())){
    var timePart = me.getLoRetailVisitKPI().getItemsByParam({ "linkedRecordId" : dateKPI.getPKey() });
    if(timePart.length === 0 || Utils.isEmptyString(timePart[0].getActualValue())){
      invalidDateTimeKPIs.push(dateKPI.getQuestion() +  " " + Localization.resolve("BoVisitAssessmentTask_TimeFormatValidationFor") + " " + dateKPI.getProductName());
    }
  }

});


if(invalidDateTimeKPIs.length > 0){
  messageCollector.add({
    "level" : "error",
    "objectClass" : "BoVisitAssessmentTask",
    "messageParams":{"invalidKPI":"\n" + invalidDateTimeKPIs.reverse().join("\n")},
    "messageID" : "BoVisitAssessmentKPIInvalidDateTimeKPI"
  }); 
}

    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code above.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    
}
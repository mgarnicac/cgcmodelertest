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
 * @function onPrimaryKPIItemChanged
 * @this BoVisitAssessmentTask
 * @kind businessobject
 * @async
 * @namespace CORE
 * @param {Object} handlerParams
 * @returns promise
 */
function onPrimaryKPIItemChanged(handlerParams){
    var me = this;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code below.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////
    
var promise = when.resolve();

for (var i = 0; i < handlerParams.modified.length; i++) {
  switch (handlerParams.modified[i]) {
    case "actualValue":

      var valueInvalid = false;

      if(handlerParams.listItem.getAidDataType() === "String" && Utils.isDefined(handlerParams.newValues.actualValue) ){

        if(handlerParams.newValues.actualValue.length > 1000){
          valueInvalid = true;
          var messageCollector = new MessageCollector();

          var error = {
            "level" : "error",
            "objectClass" : "BoVisitAssessmentTask",
            "messageParams":{"processContextValue": handlerParams.listItem.getQuestion() },
            "messageID" : "ValidationMessageInvalidData"
          }; 
          messageCollector.add(error);
          me.getLoRetailVisitKPI().suspendListRefresh();
          handlerParams.listItem.setActualValue(handlerParams.newValues.actualValue.substring(0,1000));
          me.getLoRetailVisitKPI().resumeListRefresh(true);

          var buttonValues = {};
          buttonValues[Localization.resolve("Back")] = "back";
          var messages = messageCollector.getMessages().join("<br>");
          promise = MessageBox.displayMessage(Localization.resolve("MessageBox_Title_Validation"), messages, buttonValues)
            .then(function(result){
            messageCollector.destroy();
          });

        } else{
          promise = when.resolve("valid");
        }
      }

      if(!valueInvalid){
        var relatedList = me.getLoRetailVisitKPI();
        var relatedItem = relatedList.getItemByPKey(handlerParams.listItem.getPKey());

        if(handlerParams.newValues.actualValue !== relatedItem.getActualValue()){
          me.getLoRetailVisitKPI().suspendListRefresh();
          relatedItem.setActualValue(handlerParams.newValues.actualValue);
          me.getLoRetailVisitKPI().resumeListRefresh(true);
        }
      }

      break;
  }
}

    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code above.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    return promise;
}
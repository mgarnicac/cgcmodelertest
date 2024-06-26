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
 * @function cpCalculate
 * @this BoOrder
 * @kind TODO_ADD_BUSINESS_OBJECT_TYPE
 * @async
 * @namespace CORE
 * @param {String} triggeredByFreeItem
 * @returns promise
 */
function cpCalculate(triggeredByFreeItem){
    var me = this;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code below.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////
    
if(SalesforceTools.isPricingLicenseAvailable()){



  var calculationComplete;

  //refresh Order data - will be checked if different to current data in engine
  if (me.getBoOrderMeta().getCpPricingDate() === "DeliveryDate") {
    me.setPricingDate(me.getDeliveryDate());
  }
  if (me.getFirstCalculation() === "1") {
    me.setFirstCalculation("0");
  }

  CP.PricingHandler.getInstance().updateOrder(me.getPricingDate(), me.getCurrency(), me.cpGetRelevantOrderAttributes());

  var results = [];
  var recalculationRequired = "0";
  var calcSuccess = true;
  var splittingRule = me.getSplittingRule();

  if(me.isGroupingEnabled()) {
    var groups = [];
    var determineGroups = function (x) {
      var group = x.getSplittingGroup();
      var quantity = x.getQuantity();
      if(groups.indexOf(group) === -1 && quantity > 0) {
        groups.push(group);
      }
    };
    me.getLoItems().getAllItems().forEach(determineGroups);

    var groupIndex = 0;
    var currentGroup = " ";

    var calculationFunction = function() {
      if(groupIndex < groups.length) {
        currentGroup = groups[groupIndex];

        var itemFilterCallback = function(x){return x.dicAttributes.getItem('splittingGroup') === currentGroup;};

        return CP.PricingHandler.getInstance().calculateOrderValue(itemFilterCallback).then(function(groupResult) {
          groupResult.splittingGroup = currentGroup;
          results.push(groupResult);
          groupIndex++;

          return calculationFunction();
        });
      }
      return when.resolve();
    };

    calculationComplete = calculationFunction();
  }
  else {
    calculationComplete = CP.PricingHandler.getInstance().calculateOrderValue().then(function (result) {
      if (Utils.isDefined(result)) {
        result.splittingGroup = " ";
        results.push(result);
      }
    });
  }

  var promise = calculationComplete.then(function() {
    if (me.isGroupingEnabled()) {
      return me.resetCalculationResult();
    }
  }).then(function() {
    var deferreds = [];
    calcSuccess = results.length > 0;

    for(var j = 0;  j < results.length; j++) {
      deferreds.push(me.cpHandleCalculateResult(triggeredByFreeItem, results[j]));
      calcSuccess = calcSuccess && results[j].CSTAT;
    }

    return when.all(deferreds);
  }).then(function(reCalcReq) {
    recalculationRequired = reCalcReq.reduce(
      function (recalcRequired, recalcReqResult) {
        return recalcReqResult === "1" ? "1" : recalcRequired;
      }, "0");

    if (me.getIsOrderPaymentRelevant() === '1') {
      return me.setPaidAmountReceipt(me.getGrossTotalValueReceipt());
    }
  }).then(function() {
    if(calcSuccess) {
      if (me.getPaidAmount() >= 0) {
        me.setDebitCredit("Debit");
      } else {
        me.setDebitCredit("Credit");
      }

      //Update total value at item filter
      me.updateItemFilterTotalValue();
      me.setCalculationTime(Utils.createAnsiDateTimeNow());
      me.setCalculationStatus("1");
    }
    else {
      me.setCalculationTime(Utils.createAnsiDateTimeNow());
      me.setCalculationStatus("4");
      return me.resetCalculationResult();
    }      

  }).then(function() {
    return me.createPricingInfoJson();
  }).then(function() {
    if(recalculationRequired === "1") {
      AppLog.log("#CP  ----> Recalculation triggered! <---- ");
      return me.cpCalculate("1");
    }
  });
}else{
  var messageCollector = new MessageCollector();
  var newError = {
    "level": "error",
    "objectClass" : "BoOrder",
    "messageID" : "CasSdoNoPPPLicense"
  };
  messageCollector.add(newError);

  var buttonValues = {};
  var messages = messageCollector.getMessages().join("<br>");
  buttonValues[Localization.resolve("OK")] = "ok";
  promise = MessageBox.displayMessage(Localization.resolve("MessageBox_Title_Error"), messages, buttonValues).then(function () {
    return "0";
  });
}

    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code above.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    return promise;
}
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
 * @function cpInitComplexPricing
 * @this BoTruckLoad
 * @kind businessobject
 * @async
 * @namespace CORE
 * @returns promise
 */
function cpInitComplexPricing(){
    var me = this;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code below.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////
    
var promise = when.resolve();

if ((me.getBoOrderMeta().getComputePrice() === "4" || me.getBoOrderMeta().getComputePrice() === "5") && !Utils.isEmptyString(me.getBoOrderMeta().getCndCpCalculationSchemaPKey())) {
  me.setCndCpCalculationSchemaPKey(me.getBoOrderMeta().getCndCpCalculationSchemaPKey());

  if (Utils.isDefined(CP)) {
    var obj = {
      "VariantString1": "",
      "VariantString2": "",
      "VariantString3": "",
      "VariantString4": "",
      "VariantString5": "",
      "VariantDecimal1": 0,
      "VariantDecimal2": 0,
      "VariantDecimal3": 0,
      "VariantDecimal4": 0,
      "VariantDecimal5": 0
    };

    promise = CP.PricingHandler.getInstance().initOrder(me.getPKey(), me.getSdoMetaPKey(), "TruckLoad", Utils.createDateNow(), me.getCurrency(), me.getBoOrderMeta().getCndCpCalculationSchemaPKey(), me.cpGetRelevantOrderAttributes(),
                                                        ApplicationContext.get('user').getDistribChannel(), ApplicationContext.get('user').getDivision(), obj,me.getBoOrderMeta().getGeneratePricingLog()).then(
      function () {
        var obj = {
          "VariantItemString1": "",
          "VariantItemString2": "",
          "VariantItemString3": "",
          "VariantItemString4": "",
          "VariantItemString5": "",
          "VariantItemDecimal1": 0,
          "VariantItemDecimal2": 0,
          "VariantItemDecimal3": 0,
          "VariantItemDecimal4": 0,
          "VariantItemDecimal5": 0
        };

        if (Utils.isDefined(me.getLoItems())) {
          var items = me.createPricingInformationForList();
          var orderItemsBiggerZero = [];
          var variantItemAttributes = [];
          var currentItem;
          var orderItem;

          for (var i = 0; i < items.length; i++) {
            orderItem = items[i].getData();

            if (Utils.isDefined(orderItem.quantity) && orderItem.quantity > 0) {
              orderItemsBiggerZero.push(orderItem);
              variantItemAttributes.push({
                "SdoItemPKey": orderItem.pKey,
                "VariantAttributes": obj
              });
            }
          }

          if (orderItemsBiggerZero.length > 0) {
            var initialCalculation = true;
            if (me.getCalculationStatus() == "1") {
              initialCalculation = false;
            }

            return CP.PricingHandler.getInstance().addProducts(orderItemsBiggerZero, variantItemAttributes).then(me.cpCalculate(initialCalculation).then(
              function () {
                me.setPricingReady("1");
              }
            ));
          }
          else {
            me.setPricingReady("1");
          }
        }
      }
    );
  }
}

    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code above.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    return promise;
}
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
 * @function validateProductUniqueness
 * @this BoTruckLoad
 * @kind businessobject
 * @namespace CORE
 * @param {messageCollector} messageCollector
 */
function validateProductUniqueness(messageCollector){
    var me = this;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code below.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////
    
var nonEditableOrIgnoreRelease = (!me.isEditable() || me.getReleaseIgnored() == "1");

if (!nonEditableOrIgnoreRelease && me.getValidateForUniqueness() !== "1"){

  if(me.getReleaseTriggered() !== "1"){
    if(messageCollector.onCancel !== "setValidateForQuantityFlag"){
      return;
    }
  }

  // Get all item templates and store meta information in a dictionary
  var itemMetas = me.getBoOrderMeta().getItemMetaJsonDictionary();
  // Get all order items
  var items = me.getLoItems().getAllItems();
  var notUniqueItems = Utils.createDictionary();
  var checkForUniqueItems = "0";
  var loItems = me.getLoItems();

  // Loop over items and validate according to current template
  for (var j = 0; j < items.length; j++) {
    var item = items[j];
    var sdoItemMetaPKey = item.getSdoItemMetaPKey();
    var prdMainPKey = item.getPrdMainPKey();
    var quantityLogisticUnit= item.getQuantityLogisticUnit();
    var quantity = item.getQuantity();
    var targetQuantity =  item.getTargetQuantity();
    var objectStatus = item.getObjectStatus();
    var itemMeta = itemMetas.get(sdoItemMetaPKey);

    if (itemMeta.checkUniqueness == "1"){
      if(itemMeta.saveZeroQuantity == '1'){
        checkForUniqueItems = "1";
      }
      else if(itemMeta.saveZeroQuantity == '0'){
        if(quantity !== 0 && targetQuantity !== 0){
          checkForUniqueItems = "1";
        }
        else{
          checkForUniqueItems = "0";
        }
      }
      if(checkForUniqueItems == "1"){
        var uniquenessKey = prdMainPKey + "_" + sdoItemMetaPKey + "_" + quantityLogisticUnit;
        var stateDirty = STATE.DIRTY | STATE.PERSISTED;
        var stateNewDirty = STATE.NEW | STATE.DIRTY;
        //Check for numer of items with that key in the list of items
        var findItem = loItems.getItemsByParam({ "prdMainPKey": prdMainPKey, "sdoItemMetaPKey": sdoItemMetaPKey, "quantityLogisticUnit": quantityLogisticUnit });
        if (objectStatus == stateNewDirty || objectStatus == stateDirty) {

          // Check if current item has already been checked for uniqueness (in case of we reach the duplicate)
          if (notUniqueItems.containsKey(uniquenessKey) === false) {

            if (findItem.length > 1) {
              notUniqueItems.add(uniquenessKey, uniquenessKey);
              var newError = {
                "level": "error",
                "objectClass": "BoTruckLoad",
                "messageID": "CasSdoMainProductItemMetaAndUnitNotUnique",
                "messageParams": { "summary": item.getText1() }
              };

              messageCollector = me.addMessageToContainer(messageCollector, newError);
              me.setValidateForQuantity("1");
            }
          }
        }
      }
    }
  }
}

    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code above.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    
}
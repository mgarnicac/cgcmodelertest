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
 * @function updateItemFilterCountAfterAdd
 * @this BoOrder
 * @kind TODO_ADD_BUSINESS_OBJECT_TYPE
 * @namespace CORE
 * @param {Object} addProductResult
 */
function updateItemFilterCountAfterAdd(addProductResult){
    var me = this;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code below.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////
    
var filterCountIncrements = addProductResult ? addProductResult.filterCountIncrements : undefined;
var loItemFilter = me.getLoItemFilter();
var liItemFilter;
var count = 0;
var index = 0;
var params;
var allOrderItems;
var orderItem;
var alreadyCountedItem = {};

if (Utils.isDefined(filterCountIncrements)) { 
  for (index in filterCountIncrements) {
    params = { "filterCode" : filterCountIncrements[index].key };
    liItemFilter = loItemFilter.getItemsByParam(params);
    if (liItemFilter.length > 0) {
      liItemFilter = liItemFilter[0];
      count = liItemFilter.getCount();
      count = parseInt(count, 10);
      liItemFilter.setCount(count + filterCountIncrements[index].value);
    } 
  }
}
else {
  //Update All Filter counter on FreeItems update
  params = { "filterCode" : "All" };
  liItemFilter = loItemFilter.getItemsByParam(params);
  if (liItemFilter.length > 0) {  
    allOrderItems = me.getLoItems().getAllItems();
    liItemFilter = liItemFilter[0];
    for (var i = 0; i < allOrderItems.length; i++) {
      orderItem = allOrderItems[i];
      if ((orderItem.getQuantity() > 0 || Utils.isEmptyString(orderItem.getPromotionPKey())) && !Utils.isDefined(alreadyCountedItem[orderItem.getRefPKey()])) {
        count++;
        alreadyCountedItem[orderItem.getRefPKey()] = "";
      }
    }
    liItemFilter.setCount(parseInt(count, 10));
  }
}

    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code above.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    
}
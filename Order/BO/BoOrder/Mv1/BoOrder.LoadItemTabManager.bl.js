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
 * @function loadItemTabManager
 * @this BoOrder
 * @kind TODO_ADD_BUSINESS_OBJECT_TYPE
 * @async
 * @namespace CORE
 * @returns promise
 */
function loadItemTabManager(){
    var me = this;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code below.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////
    
var jsonQuery = {};
var jsonParams = [];

if (me.getBoOrderMeta().getItemListOption() == "Hierarchy") {
  var numberOfLevels = me.getBoOrderMeta().getNumberOfHierarchyLevels();
  jsonParams.push({ "field" : "criterionAttribute_Level1", "value" : me.getBoOrderMeta().getCriterionAttributeForLevel("1") });
  jsonParams.push({ "field" : "criterionAttribute_Level2", "value" : me.getBoOrderMeta().getCriterionAttributeForLevel("2") });
  jsonParams.push({ "field" : "rootLabel", "value" : me.getBoOrderMeta().getBreadCrumbRootLabel() });
  jsonParams.push({ "field" : "addProduct_CriterionAttribute", "value" : me.getBoOrderMeta().getCriterionAttributeForLevel(numberOfLevels) });
  jsonParams.push({ "field" : "numberOfLevels", "value" : numberOfLevels });

  if ((me.getPhase() == BLConstants.Order.PHASE_RELEASED) || (me.getPhase() == BLConstants.Order.PHASE_CLOSED) || (me.getPhase() == BLConstants.Order.PHASE_CANCELED) ||
      (me.getPhase() == BLConstants.Order.PHASE_READY) || (me.getPhase() == BLConstants.Order.PHASE_FEEDBACK) || (me.getBoOrderMeta().getMobilityRelevant() == "0") || (me.getSyncStatus() === BLConstants.Order.NOT_SYNCABLE)) {

    jsonParams.push({ "field" : "isShowCategories", "value" : "0" });
  } else {
    jsonParams.push({ "field" : "isShowCategories", "value" : "1" });
  }
} else {
  jsonParams.push({ "field" : "isShowCategories", "value" : "0" });
  jsonParams.push({ "field" : "addProduct_CriterionAttribute", "value" : me.getBoOrderMeta().getCriterionAttributeForFlatList() });
}
jsonQuery.params = jsonParams;

var promise = BoFactory.createObjectAsync("BoItemTabManager", jsonQuery).then(
  function (boItemTabManager) {
    boItemTabManager.setObjectStatus(STATE.PERSISTED);
    boItemTabManager.setObjectStatusFrozen(true);
    me.setBoItemTabManager(boItemTabManager);
    boItemTabManager.setBoOrder(me);
    
    var checkIfPhaseConditionIsMet = ![BLConstants.Order.PHASE_READY, BLConstants.Order.PHASE_RELEASED, BLConstants.Order.PHASE_CANCELED].includes(me.getPhase());

    if (checkIfPhaseConditionIsMet && me.getSyncStatus() !== BLConstants.Order.NOT_SYNCABLE) {
      boItemTabManager.setAddProduct_ItemMeta(me.getBoOrderMeta().getLoOrderItemMetas().getMainItemTemplate());
      boItemTabManager.setAddProduct_ScanIncrementQuantity(boItemTabManager.getAddProduct_ItemMeta().getScanIncrementQuantity());
    }

    return BoFactory.createListAsync("LoOrderItems");
  }).then(
  function(unitOfMeasures){
    var boItemTabManager = me.getBoItemTabManager();
    boItemTabManager.setLoUnitOfMeasure(unitOfMeasures);
  });

    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code above.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    return promise;
}
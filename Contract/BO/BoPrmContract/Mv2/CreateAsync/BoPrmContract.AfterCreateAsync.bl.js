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
 * @function afterCreateAsync
 * @this BoPrmContract
 * @kind TODO_ADD_BUSINESS_OBJECT_TYPE
 * @async
 * @namespace CORE
 * @param {Object} result
 * @param {Object} context
 * @returns promise
 */
function afterCreateAsync(result, context){
    var me = this;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code below.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////
    
var dateToday = Utils.createDateToday();
dateToday.setHours(0, 0, 0, 0);
var currentUser = ApplicationContext.get('user');
var usrMainPKey = currentUser.getPKey();

result.setPrmId(result.getPKey());
result.setDateInitiation(dateToday);
result.setCommitDate(dateToday);
result.setMetaId(result.getLuPrmMeta().getMetaId());
result.setWfeWorkflowPKey(result.getLuPrmMeta().getWfeWorkflowPKey());
result.setSalesOrg(currentUser.getBoUserSales().getSalesOrg());

var promise = BoFactory.loadObjectByParamsAsync("BoWorkflow", result.getQueryBy("pKey", result.getWfeWorkflowPKey())).then(
  function (boWorkflow) {
    result.setBoWorkflow(boWorkflow);
    var initialState = boWorkflow.getInitialState().toStatePKey;
    var liState = boWorkflow.getLoWfeState().getItemByPKey(initialState);
    if (Utils.isDefined(liState)) {
      result.setActualStatePKey(liState.getPKey());
      result.setNextStatePKey(liState.getPKey());
      result.setWfeStateText(liState.getText());
      result.setPhaseType(liState.getStateType());
      result.setPhase(liState.getText());
    }

    return BoFactory.createObjectAsync(BO_PRMCTTSLOGAN, {"text" : " ", "prmContractPKey" : result.getPKey()});
  }).then(
  function (object) {
    object.setObjectStatus(STATE.NEW);
    object.setText(context.jsonQuery.contractName);
    result.setBoSlogan(object);

    // add empty comment
    var loComments = result.getLoPrmCttComment();
    var liNewComment = {
      "pKey" : PKey.next(),
      "text" : " ",
      "usage" : "Comment",
      "prmContractPKey" : result.getPKey(),
      "objectStatus" : STATE.NEW
    };
    loComments.addListItems([liNewComment]);
    loComments.setCurrent(liNewComment);
    loComments.setObjectStatus(STATE.NEW);

    var jsonParams = {};
    jsonParams.contractMetaPKey = result.getPrmMetaPKey();
    return Facade.selectSQL("DsLoPrmCttTactics", "TacticPresets", jsonParams);
  }).then(
  function (list) {
    var rawList = list.getResultData();

    for (var idxList = 0; idxList < rawList.length; idxList++) {
      var presetTactic = rawList[idxList].data.rowData;
      var newPKey = PKey.next();
      var liTactic = {
        "pKey" : newPKey,
        "active" : "1",
        "costAmount" : 0,
        "useStepper" : "0",
        "dataType" :  "Decimal",
        "minValue" : "0",
        "maxValue" : "9999999",
        "dateFrom" : result.getDateFrom(),
        "dateThru" : result.getDateThru(),
        "tacticParentPKey" : result.getPKey(),
        "tacticMetaName" : presetTactic.tacticMetaName,
        "prmMetaPKey" : presetTactic.tacticMetaPKey,
        "metaId" : presetTactic.tacticMetaId,
        "bpaCustomerPKey" : result.getBpaCustomerPKey(),
        "managementType" : " ",
        "tacticId": newPKey,
        "initiatorPKey": usrMainPKey,
        "salesOrg": currentUser.getBoUserSales().getSalesOrg(),
        "objectStatus": STATE.NEW | STATE.DIRTY
      };

      result.getLoPrmCttTactics().addListItems([liTactic]);
      result.getLuPrmCttTacticProductCount().setTacticCount(result.getLuPrmCttTacticProductCount().getTacticCount() + 1); // SF/CASDIFF: set and validate does not exist in CGCloud
    }

    //Determine substitution info for EA rights
    var params = [];
    var query = {};
    params.push({
      "field" : "referenceUserPKey",
      "value" : result.getResponsiblePKey()
    });
    params.push({
      "field" : "customerPKey",
      "value" : result.getBpaCustomerPKey()
    });
    params.push({
      "field" : "referenceDate",
      "value" : Utils.convertFullDate2Ansi(Utils.createDateToday())
    });
    query.params = params;

    return BoFactory.loadObjectByParamsAsync("LuCustomerManagementInfo", query);
  }).then(
  function (managementLookup) {
    result.setLuCustomerManagementInfo(managementLookup);
    result.setEARights();
    result.setObjectStatus(STATE.NEW | STATE.DIRTY);
    return result;
  });

    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code above.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    return promise;
}
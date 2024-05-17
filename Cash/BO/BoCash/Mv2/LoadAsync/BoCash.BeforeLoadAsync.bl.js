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
 * @function beforeLoadAsync
 * @this BoCash
 * @kind TODO_ADD_BUSINESS_OBJECT_TYPE
 * @async
 * @namespace CORE
 * @param {Object} context
 * @returns promise
 */
function beforeLoadAsync(context){
    var me = this;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code below.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////
    
var jsonQuery = context.jsonQuery;

if (!jsonQuery) {
  jsonQuery = {
    'params' : []
  };
}

var context = {
  'jsonQuery' : jsonQuery
};

var promise = Facade.getObjectAsync(BO_CASH, jsonQuery).then(
  function (selfJson) {
    context.selfJson = selfJson;
    if (me.beforeInitialize) {
      me.beforeInitialize.apply(me, [context]);
    }
    me.setProperties(selfJson);
    if (me.afterInitialize) {
      me.afterInitialize.apply(me, [context]);
    }
    if (Utils.isDefined(selfJson)) {
      var jsonParams = me.prepareLookupsLoadParams(selfJson);
      return Facade.loadLookupsAsync(jsonParams);
    } else {
      return when.resolve(null);
    }
  }).then(
  function (lookups) {
    if (Utils.isDefined(lookups)){
      me.assignLookups(lookups);
    }
    return BoFactory.loadObjectByParamsAsync(BO_ORDERMETA, me.getQueryBy("pKey", me.getSdoMetaPKey()));
  }).then(
  function (boOrderMeta) {
    if (Utils.isDefined(boOrderMeta)) {
      me.setBoCashMeta(boOrderMeta);
    } else {
      me.setBoCashMeta(null);
    }

    var sdoMetaPKey = me.getSdoMetaPKey(),
        debitCredit = me.getDebitCredit(),
        jsonQuery = {},
        jsonParams = [];

    jsonParams.push({
      "field" : "SdoMetaPKey",
      "operator" : "EQ",
      "value" : sdoMetaPKey
    });
    jsonParams.push({
      "field" : "SdoMainDebitCredit",
      "operator" : "EQ",
      "value" : debitCredit
    });
    jsonQuery.params = jsonParams;

    return BoFactory.loadObjectByParamsAsync(LO_PAYMENTMETA, jsonQuery);
  }).then(
  function (loPaymentMeta) {
    if (Utils.isDefined(loPaymentMeta)) {
      if (Utils.isDefined(me.getBoCashMeta())) {
        me.getBoCashMeta().setLoPaymentMeta(loPaymentMeta);
      }
    }

    return BoFactory.loadObjectByParamsAsync(BO_WORKFLOW, me.getQueryBy("pKey", me.getWfeWorkflowPKey()));
  }).then(
  function (boWorkflow) {
    if (Utils.isDefined(boWorkflow)) {
      me.setBoWorkflow(boWorkflow);
    } else {
      me.setBoWorkflow(null);
    }
    if (me.setObjectStatus) {
      me.setObjectStatus(this.self.STATE_UNMODIFIED);
    }

    if(me.getPhase() === "Released"){
      return me.determineSysReleaseProcessPKey();
    }else{
      return "";
    }
  }).then(
  function (sysReleaseProcessPKey) {   
    if(!Utils.isEmptyString(sysReleaseProcessPKey)){
      return BoFactory.loadListAsync("LoSysReleaseProcessStep", me.getQueryBy("sysReleaseProcessPKey", sysReleaseProcessPKey));
    }else{
      return undefined;
    }
  }).then(
  function (loSysReleaseProcessStep) {
    if (Utils.isDefined(loSysReleaseProcessStep)) {

      var stepItems = loSysReleaseProcessStep.getAllItems();
      if(stepItems.length > 0){
        me.setSysReleaseProcessStepsExists("1");
      }else{
        me.setSysReleaseProcessStepsExists("0");
      }
    } else {
      me.setSysReleaseProcessStepsExists("0");
    }

    return me.loadPayments();
  }).then(
  function () {

    if(me.getDocumentType() === "CashCheckIn"){
      var jsonQuery = {};
      var jsonParams = [];

      jsonParams.push({
        "field" : "tmgMainPKey",
        "operator" : "EQ",
        "value" : me.getTmgMainPKey()
      });
      jsonParams.push({
        "field" : "loPaymentMeta",
        "operator" : "EQ",
        "value" : me.getBoCashMeta().getLoPaymentMeta()
      });
      jsonParams.push({
        "field" : "sdoMainPKey",
        "operator" : "EQ",
        "value" : me.getPKey()
      });
      jsonParams.push({
        "field" : "loPayments",
        "operator" : "EQ",
        "value" : me.getLoPayments()
      });
      jsonParams.push({
        "field" : "phase",
        "operator" : "EQ",
        "value" : me.getPhase()
      });

      jsonQuery.params = jsonParams;

      return BoFactory.loadObjectByParamsAsync(LO_CHECKINPAYMENTITEMS, jsonQuery);
    }else{
      return undefined; 
    }

  }).then(
  function (loCheckInPayments) {
    if(Utils.isDefined(loCheckInPayments)){
      me.setLoCheckInPayment(loCheckInPayments);
      me.calculateAmount(loCheckInPayments);
      me.addItemChangedEventListener('loCheckInPayment', me.onCheckInItemChanged);

      var checkInItems = me.getLoCheckInPayment().getAllItems();
      var checkInItemsLength = checkInItems.length;
      var index  = 0;
      for(;index < checkInItemsLength; index++)
      {
        if(checkInItems[index].getLevel() == "main")
        {
          me.reasonCodeCheckInValidation(checkInItems[index]);
        }
      }
    }

    me.setEARights();
    me.setObjectStatus(STATE.PERSISTED);

    return me;
  });

    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code above.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    return promise;
}
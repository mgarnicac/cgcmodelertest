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
 * @function beforeSaveAsync
 * @this BoTodo
 * @kind TODO_ADD_BUSINESS_OBJECT_TYPE
 * @async
 * @namespace CORE
 * @param {Object} context
 * @returns promise
 */
function beforeSaveAsync(context){
    var me = this;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code below.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////
    
/***********************************************************
*  1 CGCloud table / 2 onPrem tables                          *
*                                                          *
*  CGCloud:    -Note is directly stored in Task.Description   *
*  onPrem:  -Separate table for Note                       *
************************************************************/

var todoSavedPromise;

if (Utils.isSfBackend()) {
  todoSavedPromise = BoFactory.createObjectAsync("BoSfHelper", {})
    .then(function(helper) {
    return helper.saveTrackedObject(me, [{name: "description", dsColumn: "Description", value: me.getBoTodoNote().getText()}]);
  });
}
else {
  todoSavedPromise = Facade.saveObjectAsync(me).then(function() {
    return true;
  });
}

var promise = todoSavedPromise.then(function(boWasSaved) {
  var deferreds = [];

  if (boWasSaved) {
    [me.getLoRecentState(), me.getLoAtmAttachment(), me.getLoTodoAttachments()].forEach(function(item) {
      if(Utils.isDefined(item)) {
        deferreds.push(item.saveAsync());
      }
    });

    // SF/CASDIF: General Dif
    // In SF case the note is saved directly to Task
    if(!Utils.isSfBackend()) {
      deferreds.push(me.getBoTodoNote().saveAsync());
    }
  }

  return when.all(deferreds).then(
    function () {
      //Reset object status for all to prevent multiple saves
      me.traverse(function(node){
        node.setObjectStatus(STATE.PERSISTED);
        if(node.isList) {
          node.getAllItems().forEach(function(item){
            item.setObjectStatus(STATE.PERSISTED);
          });
        }
      },function (a, b, c){});
    }
  );
});

    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code above.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    return promise;
}
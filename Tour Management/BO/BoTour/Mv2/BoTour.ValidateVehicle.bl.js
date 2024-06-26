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
 * @function validateVehicle
 * @this BoTour
 * @kind businessobject
 * @namespace CORE
 * @param {messageCollector} messageCollector
 */
function validateVehicle(messageCollector){
    var me = this;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code below.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////
    
var newError;

// Start--Validation for tour state transition from 'open' to 'running' state
if (me.getTmgStatus().toLowerCase() === "open") {
  if (Utils.isDefined(me.getConsiderVehicle())) {
    if(me.getConsiderVehicle()!=="No" && Utils.isEmptyString(me.getEtpVehicleTruckPKey())) {
      newError = {"level": "error",
                  "objectClass": "BoTour",
                  "messageID": "CasTmgTruckId"};
      messageCollector.add(newError);
    }

    if((me.getConsiderVehicle() === "TruckTrailer" || me.getConsiderVehicle() === "TruckTrailers") && Utils.isEmptyString(me.getEtpVehicleTrailer1PKey())) {
      newError = {"level": "error",
                  "objectClass": "BoTour",
                  "messageID": "CasTmgTrailerId"};
      messageCollector.add(newError);
    }

    if(me.getConsiderVehicle() === "TruckTrailers" && Utils.isEmptyString(me.getEtpVehicleTrailer2PKey())) {
      newError = {"level": "error",
                  "objectClass": "BoTour",
                  "messageID": "CasTmgTrailerId2"};
      messageCollector.add(newError);
    }
  }

  if (Utils.isDefined(me.getConsiderVehicleStatus())) {
    if(me.getConsiderVehicleStatus() === "Status" && me.getVehicleOKStart() !== "1") {
      newError = {"level": "error",
                  "objectClass": "BoTour",
                  "messageID": "CasTmgVehicleOKStartYes"};
      messageCollector.add(newError);
    }

    if(me.getConsiderVehicleStatus() === "StatusReason") {
      if(me.getVehicleOKStart() === "0" && Utils.isEmptyString(me.getVehicleStatusStart())) {
        newError = {"level": "error",
                    "objectClass": "BoTour",
                    "messageID": "CasTmgVehicleStatusStart"};
        messageCollector.add(newError);
      }
    }
  }
}

// Validation for tour state transition from 'running to' to 'completed' state
if (me.getTmgStatus().toLowerCase() === "running") {
  if (Utils.isDefined(me.getConsiderVehicleStatus())) {
    if(me.getConsiderVehicleStatus() === "Status" && me.getVehicleOKEnd() !== "1") {
      newError = {"level": "error",
                  "objectClass": "BoTour",
                  "messageID": "CasTmgVehicleOKEndYes"};
      messageCollector.add(newError);
    }

    if(me.getConsiderVehicleStatus() === "StatusReason") {
      if(me.getVehicleOKEnd() === "0" && Utils.isEmptyString(me.getVehicleStatusEnd())) {
        newError = {"level": "error",
                    "objectClass": "BoTour",
                    "messageID": "CasTmgVehicleStatusEnd"};
        messageCollector.add(newError);
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
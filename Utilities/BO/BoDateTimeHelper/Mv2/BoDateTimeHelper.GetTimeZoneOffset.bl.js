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
 * @function getTimeZoneOffset
 * @this BoDateTimeHelper
 * @kind businessobject
 * @namespace CORE
 * @param {Object} fullDate
 * @returns offsets
 */
function getTimeZoneOffset(fullDate){
    var me = this;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code below.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////
    
var offsets;

if (Utils.isDefined(fullDate)) {
  offsets = {};
  offsets.geoOffset = 0;
  offsets.dstOffset = 0;

  var givenDate = Utils.convertAnsiDate2Date(fullDate);
  var givenDateOffset = givenDate.getTimezoneOffset()*-1;
  var now = Utils.createDateNow();
  var firstJanuary = Utils.createSpecificDate(now.getFullYear(), 0, 1);
  var firstJanuaryOffset = firstJanuary.getTimezoneOffset()*-1;
  var firstJuly = Utils.createSpecificDate(now.getFullYear(), 6, 1);
  var firstJulyOffset = firstJuly.getTimezoneOffset()*-1;
  var julyOffsetIsGreater = firstJanuaryOffset < firstJulyOffset;
  var janOffsetIsGreater = firstJanuaryOffset > firstJulyOffset;
  var northernHemisphere = givenDateOffset === firstJulyOffset;
  var southernHemisphere = givenDateOffset === firstJanuaryOffset;
  var dstOffset = 0;

  if ((julyOffsetIsGreater && northernHemisphere) || (janOffsetIsGreater && southernHemisphere)) {
    dstOffset = 1;
  }

  offsets.geoOffset = (givenDateOffset/60) - dstOffset;
  offsets.dstOffset = dstOffset;
}

    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code above.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    return offsets;
}
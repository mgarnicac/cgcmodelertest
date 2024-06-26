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
 * @function setInventoryBalanceOfItem
 * @this BoOrder
 * @kind TODO_ADD_BUSINESS_OBJECT_TYPE
 * @async
 * @namespace CORE
 * @param {String} itemPKey
 * @returns promise
 */
function setInventoryBalanceOfItem(itemPKey){
    var me = this;
    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code below.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////
    
var promise = when.resolve();

var ivcMetaPKeys = [];
var usrMainPKeys = [];
var bpaMainPKeys = [];
var prdMainPKeys = [];
var tmgTourPKeys = [];
var etpVehiclePKeys = [];

var jsonParamsForFinding = [];
var jsonQueryForFinding = {};

// create pKey and refPKey dictionaries for LoItems
var orderItemsPKeyDict = Utils.createDictionary();
var orderItemsRefPKeyDict = Utils.createDictionary();
var items = me.getLoItems().getAllItems();
var itemsLength = items.length;

for(var index = 0; index < itemsLength; index++){
  var currentItem = items[index];

  orderItemsPKeyDict.add(currentItem.getPKey(), currentItem);

  if(!orderItemsRefPKeyDict.containsKey(currentItem.getRefPKey())){
    orderItemsRefPKeyDict.add(currentItem.getRefPKey(), []);
  }
  orderItemsRefPKeyDict.data[currentItem.getRefPKey()].push(currentItem);
}

var mainItem = orderItemsPKeyDict.get(itemPKey);
var itemMeta = me.getBoOrderMeta().getLoOrderItemMetas().getItemTemplateByPKey(mainItem.getSdoItemMetaPKey());

//Preserve object status in order to avoid saving items just because of the setting of inventory balance
var objectStatus = mainItem.getObjectStatus();

if (Utils.isDefined(itemMeta)){
  // Determine inventory information only if the item template is used to UseUserInventory or UseQuota
  if ((itemMeta.getUseUserInventory() == "1") || (itemMeta.getUseQuota() == "1")){
    // Determine balance only if not already done
    if (Utils.isEmptyString(mainItem.getIvcInformationObject())){
      // Get inventory meta information with prepared search keys
      var ivcMetasByItemMeta = me.getBoOrderMeta().getIvcMetasByItemMeta(mainItem.getSdoItemMetaPKey());

      var inventoryType = "UserInventory+Quota";
      if(itemMeta.getUseUserInventory() == "1" && itemMeta.getUseQuota() == "0")inventoryType = "UserInventory";
      if(itemMeta.getUseUserInventory() == "0" && itemMeta.getUseQuota() == "1")inventoryType = "Quota";
      
      for (var i = 0; i < ivcMetasByItemMeta.length; i++){
        
        //do not consider cash float inventory only UserInventories and Quota (according to template switch)
        var metaId = ivcMetasByItemMeta[i].getMetaId();
        if(metaId != "CashFloat" && (inventoryType === "UserInventory+Quota" || metaId === inventoryType)){
          ivcMetaPKeys.push(ivcMetasByItemMeta[i].getIvcMetaPKey());
          usrMainPKeys.push(ivcMetasByItemMeta[i].getUsrMainPKey());
          bpaMainPKeys.push(ivcMetasByItemMeta[i].getBpaMainPKey());
          tmgTourPKeys.push(ivcMetasByItemMeta[i].getTmgTourPKey());
          etpVehiclePKeys.push(ivcMetasByItemMeta[i].getEtpVehiclePKey());
        }
        
      }

      prdMainPKeys.push(mainItem.getPrdMainPKey());

      jsonParamsForFinding.push({
        "field" : "ivcMetaPKeys",
        "value" : "'" + ivcMetaPKeys.join("','") + "'"
      });
      jsonParamsForFinding.push({
        "field" : "usrMainPKeys",
        "value" : "'" + usrMainPKeys.join("','") + "'"
      });
      jsonParamsForFinding.push({
        "field" : "bpaMainPKeys",
        "value" : "'" + bpaMainPKeys.join("','") + "'"
      });
      jsonParamsForFinding.push({
        "field" : "prdMainPKeys",
        "value" : "'" + prdMainPKeys.join("','") + "'"
      });
      jsonParamsForFinding.push({
        "field" : "tmgTourPKeys",
        "value" : "'" + tmgTourPKeys.join("','") + "'"
      });
      jsonParamsForFinding.push({
        "field" : "etpVehiclePKeys",
        "value" : "'" + etpVehiclePKeys.join("','") + "'"
      });

      jsonQueryForFinding.params = jsonParamsForFinding;

      var jsonQueryForUnitConversion = {
        "params" : [{
          "field" : "productPKey",
          "value" : mainItem.getPrdMainPKey()
        }]};
      var loUnitFactorForProduct;

      promise = BoFactory.loadObjectByParamsAsync("LoUnitFactorForProduct", jsonQueryForUnitConversion).then(
        function (unitFactorForProductLo) {
          // Get conversion information for product
          loUnitFactorForProduct = unitFactorForProductLo;

          return BoFactory.loadObjectByParamsAsync("LoInventoryFinding", jsonQueryForFinding);
        }
      ).then(
        function (loInventoryFinding){
          // Build inventory information object and store at item
          var liInventory;
          var ivcInformation;
          var ivcInformationObject = [];
          var params;
          var convertedBalance;

          for (var i = 0; i < ivcMetasByItemMeta.length; i++) {
            params = {};
            params.ivcMetaPKey = ivcMetasByItemMeta[i].getIvcMetaPKey();
            params.usrMainPKey = ivcMetasByItemMeta[i].getUsrMainPKey();
            params.bpaMainPKey = ivcMetasByItemMeta[i].getBpaMainPKey();
            params.prdMainPKey = mainItem.getPrdMainPKey();
            params.tmgTourPKey = ivcMetasByItemMeta[i].getTmgTourPKey();
            params.etpVehiclePKey = ivcMetasByItemMeta[i].getEtpVehiclePKey();

            ivcInformation = {};
            ivcInformation.ivcMainPKey = " ";
            ivcInformation.balance = 0;

            liInventory = loInventoryFinding.getItemsByParam(params);

            // If inventory found, add IvcMainPKey to IvcInformationObject
            if (liInventory.length > 0){

              // If used for display, store balance at order item
              if (ivcMetasByItemMeta[i].getUsedForDisplay() == "1"){

                //Convert inventory balance to unit of item
                var orderUnitItem = me.getLoItems().getFirstOrderUnitItemForMainItem(mainItem);

                convertedBalance = loUnitFactorForProduct.convertIvcMeasureToLogisticUnit(ivcMetasByItemMeta[i].getIvcMeasure(), liInventory[0].getBalance(), orderUnitItem.getQuantityLogisticUnit(), orderUnitItem.getPiecesPerSmallestUnit());
              }

              ivcInformation.ivcMainPKey = liInventory[0].getIvcMainPKey();
              ivcInformation.balance = liInventory[0].getBalance();
            }

            ivcInformation.ivcMetaByItemMeta = ivcMetasByItemMeta[i];
            ivcInformation.unitConversionInformation = loUnitFactorForProduct;

            ivcInformationObject.push(ivcInformation);
          }

          var loOrderItems = orderItemsRefPKeyDict.get(mainItem.refPKey);
          for (var j = 0; j < loOrderItems.length; j++){
            loOrderItems[j].setIvcInformationObject(ivcInformationObject);
          }

          if(Utils.isDefined(convertedBalance)){
            mainItem.setIvcBalance(convertedBalance); 
          }

          mainItem.setObjectStatus(objectStatus);
        }
      );
    }
  }
}

    ///////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                           //
    //               Add your customizing javaScript code above.                                 //
    //                                                                                           //
    ///////////////////////////////////////////////////////////////////////////////////////////////

    return promise;
}
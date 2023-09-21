/**
 * @NApiVersion 2.x
 * @NScriptType ClientScript
 */

define(['N/record', 'N/query'], function (record,query) {

    function getLastNumber(itemPrefix) {
        var sqlQuery = "select nvl(max(COALESCE(TO_NUMBER(REGEXP_SUBSTR( replace(itemid,'" + itemPrefix + "',''), '^\\-?\\d*\\.?\\d*$')), 0)),0)+1 from item where itemid like '" + itemPrefix + "%'";
        //alert(sqlQuery);
        console.log(sqlQuery);

        var queryResult = query.runSuiteQL({
            query: sqlQuery
        });
        
        var resultValues = queryResult.results[0].values;
        var strValue = resultValues.toString();
    
        if (strValue.length < 5) {
            var leadingZeros = '00000'.slice(0, 5 - strValue.length);
            strValue = leadingZeros + strValue;
        }
        return strValue;
    }

    var isUpdating = false;

    function fieldChanged(context) {
        var currentRecord = context.currentRecord;

        if (isUpdating) {
            return;
        }
        
        var itemGroup = currentRecord.getText({
            fieldId: 'class'
        });
        var itemShortDesc = currentRecord.getValue({
            fieldId: 'custitemdisplayname'
        });
        var itemSubGroup = currentRecord.getText({
            fieldId: 'custitemsubgroup'
        });
        var itemBrand = currentRecord.getText({
            fieldId: 'custitembrand'
        });
        var itemSize = currentRecord.getValue({
            fieldId: 'custitemsize'
        });
        var itemColor = currentRecord.getText({
            fieldId: 'custitemcolor'
        });
        var itemPackUom = currentRecord.getText({
            fieldId: 'unitstype'
        });

        var itemPrefix;
        var seriesNumber;
        var itemSeries;
        var displayName;

        if (itemGroup === 'RM') { // 1 = Raw Mats
            itemPrefix = itemGroup + itemSubGroup;
            seriesNumber = getLastNumber(itemPrefix);
            itemSeries = itemGroup + itemSubGroup + seriesNumber;
            displayName = itemGroup + itemSubGroup + itemBrand + itemSize + itemColor + itemShortDesc;
        }
        if (itemGroup === 'SFG') { // 2 = Semi-Finished Goods
            itemPrefix = itemGroup + itemShortDesc + itemColor;
            seriesNumber = getLastNumber(itemPrefix);
            itemSeries = itemGroup + itemShortDesc + itemColor + seriesNumber;
            displayName = itemBrand + itemShortDesc + itemSubGroup + itemSize + itemColor;
        }
        if (itemGroup === 'FG') { // 3 = Finished Goods
            itemPrefix = itemGroup + itemBrand;
            seriesNumber = getLastNumber(itemPrefix);
            itemSeries = itemGroup + itemBrand + seriesNumber;
            displayName = itemBrand + itemSubGroup + itemPackUom;
        }
        //alert(seriesNumber);

        if (itemSeries || displayName) {

            isUpdating = true;

            currentRecord.setValue({
                fieldId: 'itemid',
                value: itemSeries
            });
            
            currentRecord.setValue({
                fieldId: 'description',
                value: displayName
            });
            

            isUpdating = false;
        }
    }

    return {
        fieldChanged: fieldChanged
    };
});

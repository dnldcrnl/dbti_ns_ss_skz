/**
 * @NApiVersion 2.x
 * @NScriptType ClientScript
 * @NModuleScope SameAccount
 *
 * Author: DBTI - Ricky Eredillas Jr.
 * Date: October 11, 2023
 */
define([],

    function () {

        function pageInit(context) {

        }

        function validateLine(context) {

            var currentRecord = context.currentRecord;
            var sublistName = context.sublistId;

            if (sublistName === 'item') {
                var qty = currentRecord.getCurrentSublistValue({
                    sublistId: sublistName,
                    fieldId: 'quantity',
                });

                if (qty < 1){

                    alert('Invalid quantity. Please enter quantity greater than 0.');

                    return false;
                }
            }
            // if (currentRecord.getCurrentSublistValue({
            //     sublistId: sublistName,
            //     fieldId: 'contribution'
            // }) !== '100.0%')
            //     currentRecord.setCurrentSublistValue({
            //         sublistId: sublistName,
            //         fieldId: 'contribution',
            //         value: '100.0%'
            //     });
            return true;
        }

        return {
            pageInit: pageInit,
            validateLine: validateLine,
        };
    }
);
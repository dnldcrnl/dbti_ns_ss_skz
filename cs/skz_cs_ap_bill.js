/**
 * @NApiVersion 2.1
 * @NScriptType ClientScript
 * @NModuleScope SameAccount
 */
define([],

    function (search) {

        function pageInit(context) {
            
        }

        function fieldChanged(context) {

            var currentRecord = context.currentRecord;

            if (context.fieldId == 'custpage_vendor_search'){
                currentRecord.setValue('entity', currentRecord.getValue('custpage_vendor_search'));
            }

        }


        return {
            pageInit: pageInit,
            fieldChanged: fieldChanged,
        };

    }
);

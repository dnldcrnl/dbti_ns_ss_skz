/**
 * @NApiVersion 2.x
 * @NScriptType ClientScript
 * @NModuleScope SameAccount
 */
define(['N/record'],

    function (record) {

        function pageInit(context) {

        }

        function fieldChanged(context) {

            var currentRecord = context.currentRecord;

            if (context.fieldId === 'entity') {

                var customer = record.load({
                    type: record.Type.CUSTOMER,
                    id: currentRecord.getValue('entity'),
                    isDynamic: true,
                });

                currentRecord.setValue('salesrep', customer.getValue('salesrep'));
            }
        }

        function sublistChanged(context) {

            var currentRecord = context.currentRecord;
            var sublistName = context.sublistId;

            if (sublistName === 'item') {

                var unit_price = currentRecord.getCurrentSublistValue({
                    sublistId: sublistName,
                    fieldId: 'rate',
                });

                var discount_rate = currentRecord.getCurrentSublistValue({
                    sublistId: sublistName,
                    fieldId: 'custcol_discountrate',
                });

                // console.log(currentRecord.getCurrentSublistValue({
                //     sublistId: sublistName,
                //     fieldId: 'amount',
                // }));
            }
            // currentRecord.setValue({
            //     fieldId: 'memo',
            //     value: 'Total has changed to ' + currentRecord.getValue({ fieldId: 'total' }) +
            //         'with operation: ' + op
            // });
        }

        return {
            pageInit: pageInit,
            fieldChanged: fieldChanged,
            sublistChanged: sublistChanged,
        };

    });

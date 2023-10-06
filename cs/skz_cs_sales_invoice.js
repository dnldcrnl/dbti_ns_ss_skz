/**
 * @NApiVersion 2.x
 * @NScriptType ClientScript
 * @NModuleScope SameAccount
 */
define(['N/record'],

    function (record) {

        function pageInit(context) {

            var currentRecord = context.currentRecord;

            currentRecord.setValue('salesrep', currentRecord.getValue('createdfrom'));

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

        return {
            pageInit: pageInit,
            fieldChanged: fieldChanged,
        };

    });

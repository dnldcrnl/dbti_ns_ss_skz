/**
 * @NApiVersion 2.x
 * @NScriptType UserEventScript
 * @NModuleScope SameAccount
 */

define(['N/ui/serverWidget', 'N/query'],

    function (serverWidget, query) {

        function beforeLoad(context) {

            var newRecord = context.newRecord;
            var form = context.form;

            var select = form.addField({
                id: 'custpage_vendor_search',
                type: serverWidget.FieldType.SELECT,
                label: 'Vendor Search'
            });

            form.insertField({
                field: select,
                nextfield: 'entity'
            });

            var sqlQuery = "SELECT -1 as id, '- Select -' as altName union all SELECT id, altName FROM vendor WHERE altName NOT LIKE '-%'";

            var queryResult = query.runSuiteQL({
                query: sqlQuery
            });

            var suppliers = queryResult.results;


            for (var index = 0; index < suppliers.length; index++) {

                select.addSelectOption({
                    value: suppliers[index].values[0],
                    text: suppliers[index].values[1],
                });

            }
        }

        return {
            beforeLoad: beforeLoad,
            // afterSubmit: afterSubmit
        };
    }
);

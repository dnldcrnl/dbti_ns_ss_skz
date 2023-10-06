/**
 * @NApiVersion 2.x
 * @NScriptType UserEventScript
 * @NModuleScope SameAccount
 * 
 */
define(['N/ui/serverWidget', 'N/query', './sfli_cs_next_code_generator'],

    function (serverWidget, query, codegen) {

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

            /**
             * 
             * Modified by: DBTI - Ricky Eredillas Jr.
             * Date: October 02, 2023
             * 
             */

            var ref_no_field = form.getField({
                id: 'tranid',
            });

            ref_no_field.updateDisplayType({
                displayType: serverWidget.FieldDisplayType.INLINE,
            });

            var next_ref_no = codegen.getNextCode(query, "select tranid from transaction where recordtype = 'vendorbill' and tranid like 'AP%' and id = (select MAX(id) from transaction where recordtype = 'vendorbill' and tranid like 'AP%')", 'AP');

            newRecord.setValue('tranid', next_ref_no);

        }

        return {
            beforeLoad: beforeLoad,
            // afterSubmit: afterSubmit
        };
    }
);

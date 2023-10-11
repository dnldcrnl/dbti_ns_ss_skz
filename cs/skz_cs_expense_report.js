/**
 * @NApiVersion 2.1
 * @NScriptType ClientScript
 * @NModuleScope SameAccount
 *
 * Author: DBTI - Ricky Eredillas Jr.
 * Date: October 10, 2023
 */
define(['N/record', 'N/query'],

    function (record, query) {

        function pageInit(context) {

        }

        function fieldChanged(context) {
            try {

                var currentRecord = context.currentRecord;

                if (context.fieldId === 'entity') {

                    var entityId = currentRecord.getValue('entity');

                    var sqlQuery = "select b.acctnumber, sum(nvl(a.debitforeignamount,0) - nvl(a.creditforeignamount,0)) as balance from transactionline a inner join account b on a.expenseaccount = b.id where b.acctnumber = (select acctnumber from account where custrecord_entity = " + entityId + ") group by b.acctnumber";

                    var queryResult = query.runSuiteQL({
                        query: sqlQuery
                    });

                    var budget_bal = queryResult.results[0].values[1];

                    currentRecord.setValue('custbody_budgetbal', budget_bal);

                }

            } catch (error) {
                console.log(error);
            }


        }


        return {
            pageInit: pageInit,
            fieldChanged: fieldChanged,
        };
    }
);
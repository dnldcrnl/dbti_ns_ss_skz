/**
 * @NApiVersion 2.1
 * @NScriptType UserEventScript
 * @NModuleScope SameAccount
 */

define(['N/record', 'N/search', 'N/ui/serverWidget', 'N/query'], function (record, search, serverWidget, query) {

    function beforeLoad(context) {
        var form = context.form;
        const newRecord = context.newRecord;

        if (context.type === context.UserEventType.CREATE) {

            var inlineHTMLField = form.getField({
                id: 'custbody_file_control'
            });

            inlineHTMLField.updateDisplayType({
                displayType: serverWidget.FieldDisplayType.HIDDEN
            });

        }

        if (context.type === context.UserEventType.VIEW || context.type === context.UserEventType.EDIT) {

            var recordStringify = JSON.stringify(newRecord);

            form.addButton({
                id: 'custpage_generate_barcodes',
                label: 'Generate Barcodes',
                functionName: `onGenerateBarcodeBtnClick(${recordStringify})`
            });

            form.clientScriptModulePath = './skz_cs_item_fulfillment.js';
        }
    }

    function beforeSubmit(context) {
        if (context.type === context.UserEventType.CREATE || context.type === context.UserEventType.EDIT) {
            var invoiceId = context.newRecord.id;
            var curRecord = context.newRecord;
            var createdFromId = curRecord.getValue({
                fieldId: 'createdfrom'
            });
            // log.debug('info','createdFromId('+createdFromId+')');

            // get createdfrom recordtype
            var sqlQueryType = "select recordtype from transaction where id = '" + createdFromId + "'";
            var queryResultType = query.runSuiteQL({
                query: sqlQueryType
            });
            var createdFromType = queryResultType.results[0].values;

            // log.debug(createdFromType,createdFromType == 'salesorder');
            if (createdFromType == 'salesorder') {
                // BLOCK ITEM FULFILLMENT ONCE SQ IS NOT YET INVOICED
                try {
                    var salesQuotationRecord = record.load({
                        type: record.Type.SALES_ORDER,
                        id: createdFromId,
                        isDynamic: false
                    });

                    var salesQuotationStatus = salesQuotationRecord.getValue({
                        fieldId: 'custbody8'
                    });

                    if (salesQuotationStatus !== '4') {
                        throw new Error('ERROR: Item fulfillment cannot be processed until the Sales Quotation has been invoiced.');
                    }

                    // BLOCK ITEM FULFILLMENT IF DATE IS NOT SAME WITH INVOICE DATE

                    // get Invoice Date
                    var sqlQueryDate = "select min(a.trandate) as trandate from transaction a where (select top 1 createdfrom from transactionline where transaction = a.id) = '" + createdFromId + "'";
                    var queryResultDate = query.runSuiteQL({
                        query: sqlQueryDate
                    });
                    var sqlQueryDateResult = queryResultDate.results[0].values;

                    var invoiceDate = formatDate(sqlQueryDateResult);
                    var irDate = formatDate(curRecord.getValue({ fieldId: 'trandate' }));

                    if (irDate !== invoiceDate) {
                        throw new Error('ERROR: Delivery date should be the same with the Invoice date. (' + invoiceDate + ')');
                    }

                } catch (e) {
                    log.error('Validation Error', e.message);
                    throw e;
                }
            }
        }
    }

    return {
        beforeLoad: beforeLoad,
        beforeSubmit: beforeSubmit
    };
});

/**
 * @NApiVersion 2.x
 * @NScriptType UserEventScript
 * @NModuleScope SameAccount
 */

define(['N/record'], function (record) {
    function afterSubmit(context) {
        if (context.type === context.UserEventType.CREATE) {
            var invoiceId = context.newRecord.id;
            var invoiceRecord = record.load({
                type: record.Type.INVOICE,
                id: invoiceId,
                isDynamic: false
            });

            // UPDATING THE STATUS OF SALES QUOTATION TO INVOICE AFTER ADDING THE INVOICE
            var salesQuotationId = invoiceRecord.getValue({
                fieldId: 'createdfrom'
            });

            if (salesQuotationId) {
                var salesQuotationRecord = record.load({
                type: record.Type.SALES_ORDER,
                id: salesQuotationId,
                isDynamic: false
                });

                var salesQuotationNumber = salesQuotationRecord.getValue({
                    fieldId: 'tranid'
                });

                salesQuotationRecord.setValue({
                fieldId: 'custbody8',
                value: '4'  // 4 = Invoiced
                });

                salesQuotationRecord.save();

                log.debug('Info', 'SQ#' + salesQuotationNumber + ' status has been updated to Invoiced.')
            }
        }
    }

    return {
        afterSubmit: afterSubmit
    };
});

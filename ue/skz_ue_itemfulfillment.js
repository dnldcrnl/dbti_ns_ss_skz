/**
 * @NApiVersion 2.1
 * @NScriptType UserEventScript
 * @NModuleScope SameAccount
 */

define(['N/record', 'N/search'], function (record, search) {

    function beforeLoad(context) {
        if (context.type === context.UserEventType.VIEW || context.type === context.UserEventType.EDIT) {
                var form = context.form;

                const record = context.newRecord;
                const items = [];

                var lineCount = record.getLineCount({
                    sublistId: 'item'
                });

                for (var i = 0; i < lineCount; i++) {
                    const item = {};

                    var itemInternalId = record.getSublistValue({ sublistId: 'item', fieldId: 'item', line: i });

                    var barcode = getItemBarcode(itemInternalId);

                    if (barcode) {

                        item.barcode = barcode;

                        item.itemName = record.getSublistValue({ sublistId: 'item', fieldId: 'itemname', line: i });

                        item.quantity = record.getSublistValue({ sublistId: 'item', fieldId: 'itemquantity', line: i });

                        items.push(item);
                    }

                }

                var jsonString = JSON.stringify(items);

                if (items.length > 0) {
                    form.addButton({
                        id: 'custpage_generate_barcodes',
                        label: 'Generate Barcodes',
                        functionName: `onGenerateBarcodeBtnClick(${jsonString})`
                    });
                }


                form.clientScriptModulePath = './skz_cs_item_fulfillment.js';
            }
    }

    function beforeSubmit(context) {
        if (context.type === context.UserEventType.CREATE) {
            var invoiceId = context.newRecord.id;
            var invoiceRecord = record.load({
                type: record.Type.ITEM_FULFILLMENT,
                id: invoiceId,
                isDynamic: false
            });

            // BLOCK ITEM FULFILLMENT ONCE SQ IS NOT YET INVOICED
            try {

                var salesQuotationId = invoiceRecord.getValue({
                    fieldId: 'createdfrom'
                });

                var salesQuotationRecord = record.load({
                    type: record.Type.SALES_ORDER,
                    id: salesQuotationId,
                    isDynamic: false
                });

                var salesQuotationStatus = salesQuotationRecord.getValue({
                    fieldId: 'custbody8'
                });

                if (salesQuotationStatus !== '4') {
                    throw new Error('ERROR: Item Fulfillment cannot be processed until the Sales Quotation has been invoiced.');
                }

            } catch (e) {
                log.error('Validation Error', e.message);
                throw e;
            }
        }
    }

    function getItemBarcode(internalId) {

        var itemSearch = search.create({
            type: search.Type.ITEM,
            filters: [
                search.createFilter({
                    name: 'internalid',
                    operator: search.Operator.ANYOF,
                    values: internalId,
                }),
            ],
            columns: [
                search.createColumn({
                    name: 'custitem_barcode'
                }),
            ],
        });

        var searchResults = itemSearch.run().getRange({ start: 0, end: 9 });

        var barcode = searchResults[0].getValue('custitem_barcode') || 'barcd';

        var recordType = searchResults[0].recordType;

        log.debug('Record Type', recordType);

        return recordType === 'inventoryitem' ? barcode : '';
    }

    return {
        beforeLoad: beforeLoad,
        beforeSubmit: beforeSubmit
    };
});

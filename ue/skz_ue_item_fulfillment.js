/**
 * @NApiVersion 2.1
 * @NScriptType UserEventScript
 */
define(['N/search'],

    (search) => {

        /**
         * Defines the function definition that is executed before record is loaded.
         * @param {Object} scriptContext
         * @param {Record} scriptContext.newRecord - New record
         * @param {string} scriptContext.type - Trigger type; use values from the context.UserEventType enum
         * @param {Form} scriptContext.form - Current form
         * @param {ServletRequest} scriptContext.request - HTTP request information sent from the browser for a client action only.
         * @since 2015.2
         */
        const beforeLoad = (context) => {


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

        /**
         * Defines the function definition that is executed before record is submitted.
         * @param {Object} scriptContext
         * @param {Record} scriptContext.newRecord - New record
         * @param {Record} scriptContext.oldRecord - Old record
         * @param {string} scriptContext.type - Trigger type; use values from the context.UserEventType enum
         * @since 2015.2
         */
        const beforeSubmit = (context) => {
        }

        /**
         * Defines the function definition that is executed after record is submitted.
         * @param {Object} scriptContext
         * @param {Record} scriptContext.newRecord - New record
         * @param {Record} scriptContext.oldRecord - Old record
         * @param {string} scriptContext.type - Trigger type; use values from the context.UserEventType enum
         * @since 2015.2
         */
        const afterSubmit = (scriptContext) => {

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

        return { beforeLoad, beforeSubmit, afterSubmit }

    });

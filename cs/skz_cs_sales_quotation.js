/**
 * @NApiVersion 2.x
 * @NScriptType ClientScript
 * @NModuleScope SameAccount
 */
define([],

    function () {

        const ITEM_SUBLIST_ID = 'item';
        const CREATE_MODE = 'create';
        const EDIT_MODE = 'edit';
        const DISCOUNT_AMOUNT_FIELD = 'custcoldiscountamount';

        var mode = "";

        function pageInit(context) {
            mode = context.mode;
        }

        function saveRecord(context) {

            var currentRecord = context.currentRecord;

            if (mode === CREATE_MODE || mode === EDIT_MODE) {

                var total_discount_amount = getDiscountAmountSum(currentRecord);

                console.log(total_discount_amount);
            }
        }

        function getDiscountAmountSum(currentRecord) {

            var total_discount_amount = 0;

            var line_count = currentRecord.getLineCount({
                sublistId: ITEM_SUBLIST_ID,
            });


            for (var line_number = 0; line_number < line_count; line_number++) {

                var discount_amount = currentRecord.getSublistValue({
                    sublistId: ITEM_SUBLIST_ID,
                    fieldId: DISCOUNT_AMOUNT_FIELD,
                    line: line_number,
                });

                total_discount_amount += discount_amount;

            }

            return total_discount_amount;
        }

        return {
            pageInit: pageInit,
            saveRecord: saveRecord
        };

    });

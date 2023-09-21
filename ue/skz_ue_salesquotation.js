/**
 * @NApiVersion 2.1
 * @NScriptType UserEventScript
 */
define(['N/record', 'N/ui/serverWidget'],

    (record, serverWidget) => {

        const ITEM_SUBLIST_ID = 'item';
        const DISCOUNT_AMOUNT_FIELD = 'custcoldiscountamount'
        const CURRENT_DATE = new Date();
        const DEBIT_ACCOUNT = 282;
        const CREDIT_ACCOUNT = 283;

        const beforeLoad = (context) => {

            if (context.type === context.UserEventType.VIEW) {

                var currentRecord = context.newRecord;

                // HIDE EDIT BUTTON WHEN STATUS IS CONFIRMED OR INVOICED
                const status = currentRecord.getValue({ fieldId: 'custbody8' });
                log.debug('Info', status);  // 2 = Confirmed, 4 = Invoiced

                if (status === '2' || status === '4') {
                    var editButton = context.form.getButton({ id: 'edit' });
                    if (editButton) {
                        editButton.isHidden = true;
                    }
                }
            }

        }

        const beforeSubmit = (context) => {
        }

        const afterSubmit = (context) => {

            var newRecord = context.newRecord;

            if (context.type === context.UserEventType.CREATE || context.type === context.UserEventType.EDIT) {

                // Getting the total discount amount from Lines sublist
                var line_discount_amount = getLineDiscountAmountSum(newRecord);

                // Get the JE Reference
                var je_reference = newRecord.getValue('custbody_skz_je_ref');

                // Check if je_reference is not empty and total line_discount_amount is greater than 0
                if (!je_reference && line_discount_amount > 0) {

                    // JE Creation
                    createJournalEntry(newRecord, line_discount_amount);
                }

            }

        }

        function getLineDiscountAmountSum(newRecord) {

            var line_discount_amount = 0; // Initialize line discount amount
            
            // Get the line count of the Items sublist
            var line_count = newRecord.getLineCount({
                sublistId: ITEM_SUBLIST_ID,
            });

            // Loop through the discount amount and summate 
            for (var line_number = 0; line_number < line_count; line_number++) {

                var discount_amount = newRecord.getSublistValue({
                    sublistId: ITEM_SUBLIST_ID,
                    fieldId: DISCOUNT_AMOUNT_FIELD,
                    line: line_number,
                });

                line_discount_amount += discount_amount;

            }

            // Return the total line discount amount
            return line_discount_amount;
        }

        // This method is for the creation of journal entry
        function createJournalEntry(newRecord, line_discount_amount) {

            var currency = newRecord.getValue('currency');

            var exchange_rate = newRecord.getValue('exchangerate');

            var sq_number = newRecord.getValue('tranid');

            var location = newRecord.getValue('location');

            var journal_entry = record.create({
                type: record.Type.JOURNAL_ENTRY,
                isDynamic: true
            });

            journal_entry.setValue({
                fieldId: 'currency',
                value: currency,
            });

            journal_entry.setValue({
                fieldId: 'exchangerate',
                value: exchange_rate,
            });

            journal_entry.setValue({
                fieldId: 'trandate',
                value: CURRENT_DATE,
            });

            journal_entry.setValue({
                fieldId: 'memo',
                value: 'Remarks from SQ# ' + sq_number,
            });

            createJournalEntryLine(journal_entry, true, DEBIT_ACCOUNT, line_discount_amount, location);

            createJournalEntryLine(journal_entry, false, CREDIT_ACCOUNT, line_discount_amount, location);

            var journal_entry_id = journal_entry.save({
                enableSourcing: true
            });

            record.submitFields({
                type: newRecord.type,
                id: newRecord.id,
                values: {
                    custbody_skz_je_ref: journal_entry_id,
                },
                options: {
                    enableSourcing: false,
                    ignoreMandatoryFields: true
                }
            });
        }

        function createJournalEntryLine(journal_entry, isDebit, account, line_discount_amount, location) {
            journal_entry.selectNewLine({
                sublistId: 'line'
            });

            journal_entry.setCurrentSublistValue({
                sublistId: 'line',
                fieldId: 'account',
                value: account,
            });

            journal_entry.setCurrentSublistValue({
                sublistId: 'line',
                fieldId: isDebit ? 'debit' : 'credit',
                value: line_discount_amount,
            });

            journal_entry.setCurrentSublistValue({
                sublistId: 'line',
                fieldId: 'location',
                value: location,
            });

            journal_entry.commitLine({
                sublistId: 'line'
            });
        }

        return { beforeLoad, beforeSubmit, afterSubmit }

    }
);

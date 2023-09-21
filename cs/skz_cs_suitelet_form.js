/**
 * @NApiVersion 2.1
 * @NScriptType ClientScript
 * @NModuleScope SameAccount
 */
define(['N/url'],

    function (url) {

        var barcode = "";
        var quantity = 0;
        var itemSelected = "";

        function pageInit(context) {

            var form = context.currentRecord;
            var barcodeField = form.getField('slf_barcode');

            barcode = form.getValue('selectfield');

            itemSelected = form.getText('selectfield');

            form.setValue('slf_barcode', barcode);

            form.setValue('slf_barcode_qty', 1);

            barcodeField.isDisabled = true;


        }

        function fieldChanged(context) {

            var form = context.currentRecord;

            if (context.fieldId === 'selectfield') {
                barcode = form.getValue('selectfield');
                form.setValue('slf_barcode', barcode);
                itemSelected = form.getText('selectfield');
            }

            if (context.fieldId === 'slf_barcode_qty') {
                quantity = form.getValue('slf_barcode_qty');
            }

        }

        function validateField(context) {
            var form = context.currentRecord;

            if (context.fieldId == 'slf_barcode_qty') {
                var qty = form.getValue('slf_barcode_qty');

                if (qty <= 0) {
                    alert('Quantity should be greater than 0.');
                    return false;
                }
            }

            return true;
        }

        function onButtonClick() {

            var items = [];

            var item = {
                barcode: barcode,
                quantity: quantity,
                itemName: itemSelected,
            };

            let splittedText = item.itemName.split('/');
            
            if (splittedText.length > 1) {

                splittedText.shift();

                item.itemName = splittedText.join('/');
                let maxLength = 60;
                if (item.itemName.length > maxLength) {
                    item.itemName = item.itemName.substring(0, maxLength);
                }
            }
 
            items.push(item);
            
            var suiteletUrl = url.resolveScript({
                scriptId: 'customscript_skz_suitelet_brc_generator',
                deploymentId: 'customdeploy1',
                returnExternalUrl: false,
                params: {
                    items: JSON.stringify(items),
                },
            });

            window.open(suiteletUrl);
        }

        return {
            pageInit: pageInit,
            fieldChanged: fieldChanged,
            validateField: validateField,
            onButtonClick: onButtonClick,
        };

    }
);

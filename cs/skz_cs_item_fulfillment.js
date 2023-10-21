/**
 * @NApiVersion 2.1
 * @NScriptType ClientScript
 * @NModuleScope SameAccount
 */
define(['N/url',],

    function (url) {

        function pageInit(context) {
        }

        function onGenerateBarcodeBtnClick(record) {

            const items = [];

            const itemsSublist = record.sublists.item;

            for (const key in itemsSublist) {

                var barcode = itemsSublist[key].custcol_item_barcode;

                // Check if barcode is not empty
                if (barcode) {

                    const item = {};

                    item.barcode = barcode;

                    item.itemName = itemsSublist[key].sitemname;

                    item.quantity = itemsSublist[key].itemquantity;

                    items.push(item);
                }

            }

            // Open printable barcodes pdf 
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
            onGenerateBarcodeBtnClick: onGenerateBarcodeBtnClick,
        };

    }
);
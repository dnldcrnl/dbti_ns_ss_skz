/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 */
define(['N/ui/serverWidget', 'N/search'], (serverWidget, search) => {

    const onRequest = (scriptContext) => {

        if (scriptContext.request.method === 'GET') {

            let form = serverWidget.createForm({
                title: 'Generate Item Barcode'
            });

            let select = form.addField({
                id: 'selectfield',
                type: serverWidget.FieldType.SELECT,
                label: 'Items'
            });

            form.clientScriptModulePath = './skz_cs_suitelet_form.js';

            var itemSearch = search.load({
                id: 'customsearch_skz_invitem_assembly_items',
            });


            var resultSet = itemSearch.run();

            resultSet.each(function (result) {
                select.addSelectOption({
                    value: result.getValue('custitem_barcode'),
                    text: `${result.getValue('itemid')}${result.getValue('displayname') && '/'}${result.getValue('displayname')}`,
                });
                return true;
            });

            form.addField({
                id: 'slf_barcode_qty',
                type: serverWidget.FieldType.INTEGER,
                label: 'Quantity'
            });

            form.addField({
                id: 'slf_barcode',
                type: serverWidget.FieldType.TEXT,
                label: 'Barcode'
            });

            form.addButton({
                id: 'gen_brc_btn',
                label: 'Generate Barcodes',
                functionName: 'onButtonClick()'
            });

            scriptContext.response.writePage(form);
        }
    }

    return { onRequest }
});
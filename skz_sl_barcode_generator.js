/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 */
define(['N/ui/serverWidget', 'N/search'], (serverWidget, search) => {

    const onRequest = (scriptContext) => {

        if (scriptContext.request.method === 'GET') {

            let form = serverWidget.createForm({
                title: 'Simple Form'
            });

            let select = form.addField({
                id: 'selectfield',
                type: serverWidget.FieldType.SELECT,
                label: 'Select'
            });

            // select.addSelectOption({
            //     value: 'a',
            //     text: 'Albert'
            // });
            // select.addSelectOption({
            //     value: 'b',
            //     text: 'Baron'
            // });


            form.addSubmitButton({
                label: 'Submit Button'
            });

            var itemSearch = search.create({
                type: search.Type.ITEM, // Set the record type to ITEM
                columns: ['displayname'] // Specify the fields you want to retrieve
            });


            var resultSet = itemSearch.run();

            resultSet.each(function (result) {
                select.addSelectOption({
                    value: result.getValue('internalid') && 'HOLD',
                    text: result.getValue('itemid'),
                });
                return true;
            });


            scriptContext.response.writePage(form);
        }
    }

    return { onRequest }
});
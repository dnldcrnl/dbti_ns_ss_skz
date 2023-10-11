/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 */

define(['N/render', 'N/record', 'N/xml'], function (render, record, xml) {

    function onRequest(context) {

        var items = context.request.parameters.items;

        var deserialized = JSON.parse(items);

        var pdfFileName = "vendorcredit";
        var renderer = render.create();

        var sampleObject = { items: deserialized };

        renderer.addCustomDataSource({
            format: render.DataSource.OBJECT,
            alias: "customData",
            data: sampleObject,
        });

        renderer.setTemplateByScriptId("CUSTTMPL_SKZ_PRINT_BARCODES");
        context.response.setHeader({
            name: 'content-disposition',
            value: 'inline; filename="' + pdfFileName + '_' + 'bsc' + '.pdf"'
        });

        var pdfFile = renderer.renderAsPdf();
        context.response.writeFile(pdfFile, true);
        // context.response.writeFile(renderer.renderAsPdf());
    }
    return {
        onRequest: onRequest
    }
})
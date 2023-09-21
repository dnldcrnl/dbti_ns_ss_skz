/**
 * @NApiVersion 2.x
 * @NScriptType ClientScript
 * @NModuleScope SameAccount
 */
define([],

    function () {

        function pageInit(context) {

        }

        function viewPdf(base64EncodedPDF) {
            window.open("data:application/pdf;base64, " + base64EncodedPDF);
        }

        return {
            pageInit: pageInit,
            viewPdf: viewPdf,
        };

    }
);

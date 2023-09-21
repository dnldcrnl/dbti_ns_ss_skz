/**
 * @NApiVersion 2.1
 * @NScriptType ClientScript
 * @NModuleScope SameAccount
 */
define(['N/url',],

    function (url) {

        function pageInit(context) {
        }

        function onGenerateBarcodeBtnClick(items) {

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

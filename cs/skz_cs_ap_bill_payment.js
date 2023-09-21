/**
 * @NApiVersion 2.1
 * @NScriptType ClientScript
 * @NModuleScope SameAccount
 */
define(['N/search'],

    function (search) {

        var CHECK_NO_ID = 'custbody_porefnum';
        var init_check_number = '';
        var check_numbers_list = [];

        function pageInit(context) {

            init_check_number = context.currentRecord.getValue(CHECK_NO_ID);

            var ap_bill_payments = search.load({
                id: 'customsearch_skz_check_numbers',
            });

            var resultSet = ap_bill_payments.run();

            resultSet.each(function (result) {
                check_numbers_list.push(result.getValue(CHECK_NO_ID));
                return true;
            });
        }

        function validateField(context) {

            var currentRecord = context.currentRecord;

            if (context.fieldId == CHECK_NO_ID) {

                var check_number = currentRecord.getValue(CHECK_NO_ID);

                if (init_check_number === check_number) return true;

                if (check_numbers_list.includes(check_number)) {
                    alert('Check number already exists!');
                    currentRecord.setValue(CHECK_NO_ID, init_check_number);
                    return false;
                }
            }

            return true;
        }

        return {
            pageInit: pageInit,
            validateField: validateField,
        };

    }
);

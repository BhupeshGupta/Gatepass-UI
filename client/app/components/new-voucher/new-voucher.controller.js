import angular from 'angular';

function NewVoucherController(DocumentService, $element) {
    var vm = this;
    vm.submit = function () {
        var gatepass = angular.copy(vm.gatepass);

        function getItem(item) {
            if (item == 'FC47') {
                return "FC47.5";
            } else if (item == 'FC47_5') {
                return "FC47.5L"
            } else if (item == 'EC47') {
                return "EC47.5";
            } else if (item == 'EC47_5') {
                return "EC47.5L"
            } else {
                return item;
            }
        };
        // new items
        var newItems = [];
        angular.forEach(gatepass.items, function (value, key) {
            newItems.push({
                "item": getItem(key),
                "quantity": value
            });
        });
        gatepass.items = newItems;

        if (gatepass.vehicle)
            gatepass.vehicle = gatepass.vehicle.value;
        if (gatepass.driver)
            gatepass.driver = gatepass.driver.value;
        if (gatepass.fuel_pump)
            gatepass.fuel_pump = gatepass.fuel_pump.value;

        gatepass.gatepass_type = "Out";
        gatepass.voucher_type = "ERV";
        gatepass.company = "Arun Logistics";
        gatepass.dispatch_destination = "Other";

        vm.onCreation({
            gatepass: gatepass
        });

        var autoComp = $($element).find('md-autocomplete-wrap');

        autoComp.each(function (index, elem) {
            angular.element(elem).scope().$mdAutocompleteCtrl.clear();
        });
        vm.gatepass = {};
    };



    vm.searchVehicle = function (query) {
        return DocumentService.search('Transportation Vehicle', query, {}).then(function (data) {
            return data.data.results;
        });
    };
    vm.searchDriver = function (query) {
        return DocumentService.search('Driver', query, {}).then(function (data) {
            return data.data.results;
        });
    };

}
export default NewVoucherController;

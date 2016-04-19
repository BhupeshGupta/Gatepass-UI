import angular from 'angular';

function NewVoucherController() {
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
        vm.onCreation({
            gatepass: gatepass
        });
        vm.gatepass = {};
    }
}
export default NewVoucherController;

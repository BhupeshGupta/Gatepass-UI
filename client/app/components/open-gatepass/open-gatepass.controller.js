import angular from 'angular';
class OpenGatepassController {
    constructor($scope, $mdDialog, $mdMedia, $timeout) {

        var vm = this;
        vm.itemDetails = [];
        this.showAdvanced = (ev) => {
            $mdDialog.show({
                templateUrl: './app/components/expense/expense.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: true
            });
        };

        vm.openningStock = {};
        angular.forEach(vm.gatepass.outGatepass.items, function (value, index) {
            vm.openningStock[value.item] = value.quantity;
        });

        function resetGrTotal() {
            vm.grTotal = {
                "item_delivered": {},
                "item_received": {}
            };
        }

        vm.addRow = function () {
            vm.gatepass.transactions.push({
                "creation": "2016-04-16 13:14:15.274965",
                "doctype": "Goods Receipt",
                "owner": "Administrator",
                "delivered_quantity": 10,
                "item_delivered": "FC47.5",
                "residue": 0,
                "modified_by": "Administrator",
                "posting_time": "13:14:15.274844",
                "location_longitude": "75.8725",
                "transaction_date": "2016-04-16",
                "vehicle": "PB10FF5964",
                "warehouse": "Radhey Shaym - AL",
                "docstatus": 1,
                "received_quantity": 10,
                "customer_image": "/files/GR-16-38_customer.jpg",
                "delivery_type": "Refill",
                "company": "Arun Logistics",
                "signature": "/files/GR-16-38_signature.jpg",
                "location_latitude": "30.8977764",
                "excess": 0,
                "remarks": "\n",
                "item_received": "EC47.5",
                "customer": "BHOGAL SALES CORPORATION",
                "goods_receipt_number": "",
                "short": 0,
                "name": "GR-16-38",
                "customer_document_id": "0",
                "modified": "2016-04-16 13:14:15.274965",
                "is_opening": 0,
                "cancelled": 0,
                "posting_date": "2016-04-16"
            });
            calculate();

            //            $timeout(vm.addRow, 10 * 1000);

        };

        function calculate() {
            resetGrTotal();

            if (vm.gatepass.transactions)
                angular.forEach(vm.gatepass.transactions, function (value, index) {
                    vm.grTotal.item_delivered[value.item_delivered] = vm.grTotal.item_delivered[value.item_delivered] || 0;
                    vm.grTotal.item_received[value.item_received] = vm.grTotal.item_received[value.item_received] || 0;
                    vm.grTotal.item_delivered[value.item_delivered] += value.delivered_quantity;
                    vm.grTotal.item_received[value.item_received] += value.received_quantity;
                });

            vm.gatepass.closingStock = {};

            angular.forEach(vm.grTotal.item_delivered, function (qty, item) {
                if (item) {
                    vm.gatepass.closingStock[item] = vm.openningStock[item] || 0;
                    vm.gatepass.closingStock[item] -= qty;
                }
            });

            angular.forEach(vm.grTotal.item_received, function (qty, item) {
                if (item) {
                    vm.gatepass.closingStock[item] = vm.openningStock[item] || 0;
                    vm.gatepass.closingStock[item] += qty;
                }
            });

            angular.forEach(vm.openningStock, function (qty, item) {
                if (Object.keys(vm.gatepass.closingStock).indexOf(item) == -1) {
                    vm.gatepass.closingStock[item] = qty;
                }
            });

            vm.gatepass.closingCalculations = [];
            angular.forEach(vm.openningStock, function (qty, item) {
                vm.gatepass.closingCalculations.push({
                    name: item,
                    opening: vm.openningStock[item],
                    out: vm.grTotal.item_delivered[item],
                    in : vm.grTotal.item_received[item],
                    closing: qty
                });
            });

            vm.gatepass.closingCalculations.sort(function (item1, item2) {
                let baseItem1 = item1.name.replace('FC', '').replace('EC', '').replace('L', '');
                let baseItem2 = item2.name.replace('FC', '').replace('EC', '').replace('L', '');

                if (baseItem1 == baseItem2) {
                    if (item1.name.indexOf('FC') > -1) return -1;
                    return 1;
                }

                return parseFloat(baseItem1) - parseFloat(baseItem2);
            })

            let lastBaseItem = null;
            angular.forEach(vm.gatepass.closingCalculations, function (item, index) {
                item.css = ''
                let baseItem = item.name.replace('FC', '').replace('EC', '');
                if (baseItem !== lastBaseItem)
                    item.css += ' filleditem';
                else
                    item.css += ' emptyitem';
                lastBaseItem = baseItem;
            });

            for (let i = 0; i < vm.gatepass.closingCalculations.length - 1; i++) {
                // Create Css Pairs
                let item1 = vm.gatepass.closingCalculations[i];
                let item2 = vm.gatepass.closingCalculations[i + 1];
                let baseItem1 = item1.name.replace('FC', '').replace('EC', '');
                let baseItem2 = item2.name.replace('FC', '').replace('EC', '');
                if (baseItem1 == baseItem2) {
                    item1.css += ' item_pair';
                    item2.css += ' item_pair';
                }
            }

        }

        calculate();

        if (!this.disabled) {
            //vm.addRow();
            //$timeout(vm.addRow, 10 * 1000);
        }

        vm.refresh = function () {
            vm.onRefresh({
                tripid: vm.gatepass.name
            }).then(function (data) {
                vm.gatepass = data;
                calculate();
            });
        };

        vm.submit = function () {
            var gatepass = angular.copy(vm.gatepass.inGatepass);

            {
                let rs = [];
                angular.forEach(vm.gatepass.closingStock, function (value, key) {
                    rs.push({
                        item: key,
                        quantity: value
                    })
                });

                gatepass.items = rs;
            }

            if (gatepass.fuel_pump) {
                gatepass.fuel_pump = gatepass.fuel_pump.value;
            }

            gatepass.vehicle = vm.gatepass.outGatepass.vehicle;
            gatepass.driver = vm.gatepass.outGatepass.driver;
            gatepass.trip_id = vm.gatepass.name;

            vm.onSubmit({
                gatepass: gatepass
            });
        };

    }

}
export default OpenGatepassController;

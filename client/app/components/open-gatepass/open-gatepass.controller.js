import angular from 'angular';

class OpenGatepassController {
    constructor($scope, $mdDialog, $mdMedia, $timeout) {

      var vm  = this;
      vm.itemDetails  = [];

        this.showAdvanced = (ev) => {
            $mdDialog.show({
                templateUrl: './app/components/expense/expense.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: true
            });
        };

         vm.openningStock = {};
         console.log(vm.gatepass.items);
         angular.forEach(vm.gatepass.items, function(value, index){
          vm.openningStock[value.item]=value.quantity;
        });

        function resetGrTotal(){
        vm.grTotal={
          "item_delivered":{
          },
          "item_received":{
          }
        };}

        vm.addRow = function() {
          vm.itemDetails.push({
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

          resetGrTotal();
          angular.forEach(vm.itemDetails, function(value, index){
            vm.grTotal.item_delivered[value.item_delivered] = vm.grTotal.item_delivered[value.item_delivered] || 0;
            vm.grTotal.item_received[value.item_received] = vm.grTotal.item_received[value.item_received] || 0;
            vm.grTotal.item_delivered[value.item_delivered]+=value.delivered_quantity;
            vm.grTotal.item_received[value.item_received]+=value.received_quantity;
          });

          vm.closingStock={};

          angular.forEach(vm.grTotal.item_delivered, function(value, key){
            vm.closingStock[key]=vm.openningStock[key]||0;
            vm.closingStock[key]-=value;

          });

          angular.forEach(vm.grTotal.item_received, function(value, key){
            vm.closingStock[key]=vm.openningStock[key]||0;
            vm.closingStock[key]+=value;
          });



          console.log(vm.grTotal);
          $timeout(vm.addRow, 10*1000);
      };

      vm.addRow();

      $timeout(vm.addRow, 10*1000);

    }
}
export default OpenGatepassController;

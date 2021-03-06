function PumpFormController($scope, $mdDialog, $mdMedia, DocumentService) {
    "ngInject";
    // for autocomplete pump
    this.showAdvanced = (ev) => {
        $mdDialog.show({
            template: '<expense></expense>',
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose: true
        });
    };

    // for autocomplete pump
    this.searchPump = function (query) {
        return DocumentService.search('Supplier', query, {
            supplier_type: "Fuel Pump"
        }).then(function (data) {
            return data.data.results;
        })
    }
}


export default PumpFormController;

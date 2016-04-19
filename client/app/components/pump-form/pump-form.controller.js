class PumpFormController {
    constructor($scope, $mdDialog, $mdMedia) {
        this.showAdvanced = (ev) => {
            $mdDialog.show({
                templateUrl: './app/components/expense/expense.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: true
            });
        };
    }
}

export default PumpFormController;

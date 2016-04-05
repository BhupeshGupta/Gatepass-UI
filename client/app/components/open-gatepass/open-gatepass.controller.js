class OpenGatepassController {
    constructor($scope, $mdDialog, $mdMedia) {
        console.log("Controller Ran");
        this.showAdvanced = (ev) => {
            $mdDialog.show({
                templateUrl: './app/components/expense/expense.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: true
            });
        }
    }



}

console.log("Controller File Read");

export default OpenGatepassController;

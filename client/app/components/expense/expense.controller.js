import angular from 'angular';

function ExpenseController() {
    var ec = this;

    // add toll list
    ec.tollListDetail = [];
    ec.addTollList = function () {
        ec.tollListDetail.push({});
    };
    // remove toll list
    ec.delete = function (index) {
        ec.tollListDetail.splice(index, 1);
    };




}
export default ExpenseController;

import template from './expense.html';
import './expense.scss';
import ExpenseController from './expense.controller.js';


let expenseComponent = {
    restrict: 'E',
    bindings: {
        gatepass: '='
    },
    template,
    controller: ExpenseController,
    controllerAs: 'ec'
};


export default expenseComponent;

import template from './expense.html';
import ExpenseController from './expense.controller';
import './expense.scss';

let expenseComponent = {
    restrict: 'E',
    bindings: {
        expense: '='
    },
    template,
    controller: ExpenseController,
    controllerAs: 'ec'
};

export default expenseComponent;

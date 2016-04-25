import angular from 'angular';
import uiRouter from 'angular-ui-router';
import expenseComponent from './expense.component';

let expenseModule = angular.module('expenseComponent', [])
    .component('expense', expenseComponent);
export default expenseModule;

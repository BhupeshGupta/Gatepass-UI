import angular from 'angular';
import uiRouter from 'angular-ui-router';
import expenseComponent from './expense.component';

let expenseModule = angular.module('expense', ['ngMaterial', 'ngMessages', 'material.svgAssetsCache'])
    .component('expense', expenseComponent);

export default expenseModule;

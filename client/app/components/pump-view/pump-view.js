import angular from 'angular';
import uiRouter from 'angular-ui-router';
import pumpViewComponent from './pump-view.component';

let pumpViewModule = angular.module('pumpViewComponent', ['ngMaterial', 'ngMessages', 'material.svgAssetsCache'])
    .component('pumpView', pumpViewComponent);

export default pumpViewModule;

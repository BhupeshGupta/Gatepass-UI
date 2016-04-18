import angular from 'angular';
import uiRouter from 'angular-ui-router';
import pumpFormComponent from './pump-form.component';


let pumpFormModule = angular.module('pumpForm', ['ngMaterial', 'ngMessages', 'material.svgAssetsCache'])
    .component('pumpForm', pumpFormComponent);

export default pumpFormModule;

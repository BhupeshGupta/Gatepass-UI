import angular from 'angular';
import uiRouter from 'angular-ui-router';
import openGatepassComponent from './open-gatepass.component';

let gatepassModule = angular.module('openGatepass', ['ngMaterial', 'ngMessages', 'material.svgAssetsCache'])
    .component('openGatepass', openGatepassComponent);

export default gatepassModule;

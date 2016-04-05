import angular from 'angular';
import uiRouter from 'angular-ui-router';
import closeGatepassComponent from './close-gatepass.component';

let gatepassModule = angular.module('closeGatepass', [])
    .component('closeGatepass', closeGatepassComponent);

export default gatepassModule;

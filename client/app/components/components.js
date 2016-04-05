import angular from 'angular';
import openGatepass from './open-gatepass/open-gatepass';
import newVoucher from './new-voucher/new-voucher';
import closeGatepass from './close-gatepass/close-gatepass';
import expense from './expense/expense';

let componentModule = angular.module('app.components', [
    openGatepass.name
    , newVoucher.name
    , closeGatepass.name
    , expense.name
, ]);


export default componentModule;

import angular from 'angular';
import openGatepass from './open-gatepass/open-gatepass';
import newVoucher from './new-voucher/new-voucher';
import closeGatepass from './close-gatepass/close-gatepass';
import expense from './expense/expense';
import pumpForm from './pump-form/pump-form';
import pumpView from './pump-view/pump-view';


let componentModule = angular.module('app.components', [
    openGatepass.name,
    newVoucher.name,
    closeGatepass.name,
    expense.name,
    pumpForm.name,
    pumpView.name

, ]);


export default componentModule;

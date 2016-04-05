import angular from 'angular';
import uiRouter from 'angular-ui-router';
import newVoucherComponent from './new-voucher.component';

let newVoucherModule = angular.module('newVoucherComponent', [])
    .component('newVoucher', newVoucherComponent);

export default newVoucherModule;

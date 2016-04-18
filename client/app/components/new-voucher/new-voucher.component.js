import template from './new-voucher.html';
import NewVoucherController from './new-voucher.controller.js';
import './new-voucher.scss';

let newVoucherComponent = {
    restrict: 'E',
    bindings: {
        onCreation: '&'
    },
    template,
    controller: NewVoucherController,
    controllerAs: 'nvc'
};

export default newVoucherComponent;

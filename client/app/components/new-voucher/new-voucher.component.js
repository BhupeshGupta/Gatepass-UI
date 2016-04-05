import template from './new-voucher.html';
import NewVoucherController from './new-voucher.controller.js';
import './new-voucher.scss';

let newVoucherComponent = {
    restrict: 'E',
    bindings: {
        voucherSubmit: '&'
    },
    template,
    controller: NewVoucherController,
    controllerAs: 'mc'
};

export default newVoucherComponent;

import template from './pump-form.html';
import PumpFormController from './pump-form.controller';
import './pump-form.scss';

let pumpFormComponent = {
    restrict: 'E',
    bindings: {
        gatepass: '='
    },
    template,
    controller: PumpFormController,
    controllerAs: 'pfc'
};

export default pumpFormComponent;

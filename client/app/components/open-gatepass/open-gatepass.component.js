import template from './open-gatepass.html';
import OpenGatepassController from './open-gatepass.controller';
import './open-gatepass.scss';


let openGatepassComponent = {
    restrict: 'E',
    bindings: {
        gatepass: '=',
        disabled: '=',
        onSubmit: '&'
    },
    template,
    controller: OpenGatepassController,
    controllerAs: 'vm'
};

export default openGatepassComponent;

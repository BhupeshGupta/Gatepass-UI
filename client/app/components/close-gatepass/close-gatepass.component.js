import template from './close-gatepass.html';
import CloseGatepassController from './close-gatepass.controller';
import './close-gatepass.scss';

let closeGatepassComponent = {
    restrict: 'E',
    bindings: {
        gatepass: '='
    },
    template,
    CloseGatepassController,
    controllerAs: 'cgc'
};

export default closeGatepassComponent;

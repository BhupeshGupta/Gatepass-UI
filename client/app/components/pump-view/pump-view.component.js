import template from './pump-view.html';
import PumpViewController from './pump-view.controller';
import './pump-view.scss';

let pumpViewComponent = {
    restrict: 'E',
    bindings: {
        gatepass: '='
    },
    template,
    controller: PumpViewController,
    controllerAs: 'pvc'
};

export default pumpViewComponent;

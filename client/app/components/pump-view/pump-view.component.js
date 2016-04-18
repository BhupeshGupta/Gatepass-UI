import template from './pump-view.html';
import PumpViewController from './pump-view.controller';
import './pump-view.scss';

let pumpViewComponent = {
    restrict: 'E',
    bindings: {
        pumpView: '='
    },
    template,
    controller: PumpViewController,
    controllerAs: 'pfc'
};

export default pumpViewComponent;

import template from './header.html';
import HeaderController from './header.controller.js';
import './header.scss';

let headerComponent = {
    restrict: 'E',
    bindings: {
        onCreation: '&'
    },
    template,
    controller: HeaderController,
    controllerAs: 'hc'
};

export default headerComponent;

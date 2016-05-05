import template from './login.html';
import LoginController from './login.controller.js';
import './login.scss';

let loginComponent = {
    restrict: 'E',
    bindings: {
        onCreation: '&'
    },
    template,
    controller: LoginController,
    controllerAs: 'lc'
};

export default loginComponent;

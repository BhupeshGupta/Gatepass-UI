import angular from 'angular';
import uiRouter from 'angular-ui-router';
import loginComponent from './login.component';

import settingsFactory from './settings.js';
import userService from './user.js';



let loginModule = angular.module('login', ['ngMaterial', 'ngMessages', 'material.svgAssetsCache'])
    .component('login', loginComponent)
    .factory('SettingsFactory', settingsFactory)
    .factory('UserService', userService);

export default loginModule;

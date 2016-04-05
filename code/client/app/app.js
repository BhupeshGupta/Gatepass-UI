import angular from 'angular';
import uiRouter from 'angular-ui-router';
import 'normalize.css';

angular.module('app', [
    uiRouter,
    'ngMaterial', 'ngMdIcons'
  ])
    .config(($locationProvider) => {
        "ngInject";
        // @see: https://github.com/angular-ui/ui-router/wiki/Frequently-Asked-Questions
        // #how-to-configure-your-server-to-work-with-html5mode
        //        $locationProvider.html5Mode(true).hashPrefix('!');
    })

.config(stateConfig);

stateConfig.$inject = ["$stateProvider", "$urlRouterProvider", "$compileProvider"];

function stateConfig($stateProvider, $urlRouterProvider, $compileProvider) {
    $urlRouterProvider.otherwise('/123');

    $stateProvider.state('root', {
        template: require('./components/home/home.html'),
        url: '/123'
    });
}

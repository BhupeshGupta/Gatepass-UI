import angular from 'angular';
import uiRouter from 'angular-ui-router';
import 'normalize.css';
import Components from './components/components';

angular.module('app', [
    uiRouter,
    'ngMaterial',
    'ngMdIcons',
    Components.name
])

.config(stateConfig)

.config(function ($mdDateLocaleProvider) {
    $mdDateLocaleProvider.formatDate = function (date) {
        return moment(date).format('DD-MM-YYYY');
    };
})

.config(function ($httpProvider) {
    $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
    $httpProvider.defaults.headers.post['X-Requested-With'] = 'XMLHttpRequest';
})

.run(function ($rootScope, $state) {
    $rootScope.$on('login:success', function () {
        $state.go('root');
    });
})

// UA & Error Interceptor
.config(function ($httpProvider) {
    var popUp = null;
    $httpProvider.interceptors.push(function ($injector, $q) {
        return {
            responseError: function (rejection) {
                var stat = rejection.status;
                var msg = '';

                // Solve circular dependency
                var $mdDialog = $injector.get('$mdDialog');

                console.log(rejection);

                // ERP specific error extraction
                if (rejection.data && rejection.data.message)
                    msg = rejection.data.message;
                else if (rejection.data && rejection.data._server_messages)
                    msg = JSON.parse(rejection.data._server_messages).join('\n');

                // Generic error extraction
                else if (stat == 403) {
                    //                    var SessionService = $injector.get('SessionService');
                    msg = 'Login Required';
                    //                    $timeout(function () {
                    //                        SessionService.logout();
                    //                    }, 0);
                } else if (stat == 500)
                    msg = 'Internal Server Error';
                else if (stat == 501)
                    msg = 'Server Error';
                else if (stat == 502)
                    msg = 'Server is Offline';
                else if (stat == 503)
                    msg = 'Server is Overload or down';
                else if (stat == 504)
                    msg = 'Server is Offline';

                if (msg !== '')
                    $mdDialog.show(
                        $mdDialog.alert()
                        .parent(angular.element(document.querySelector('#popuperror')))
                        .clickOutsideToClose(true)
                        .title('Error')
                        .textContent(msg)
                        .ariaLabel('Alert Dialog Demo')
                        .ok('OK')
                    );

                return $q.reject(rejection);
            }
        };
    });
})


.factory('DocumentService', function ($http, SettingsFactory) {
    var factory = {
        search: function (documentType, query, filters) {
            var data = {
                txt: query,
                doctype: documentType,
                cmd: 'frappe.widgets.search.search_link',
                _type: 'GET',
                filters: JSON.stringify(filters),
                sid: SettingsFactory.getSid()
            };
            var url = SettingsFactory.getERPServerBaseUrl() + '?' + $.param(data);
            return $http({
                url: url,
                loading: true,
                method: 'GET'
            });
        },
        create: function (documentType, document, review) {
            var server = SettingsFactory.getERPServerBaseUrl();

            if (typeof review != 'undefined' && review) {
                var server = SettingsFactory.getReviewServerBaseUrl() + '/review';
            }

            return $http({
                url: server + '/api/resource/' + documentType + '/',
                loading: true,
                method: 'POST',
                data: $.param({
                    data: JSON.stringify(document),
                    sid: SettingsFactory.getSid(),
                    client: "app"
                })
            });

        }
    };

    return factory;
});


function stateConfig($stateProvider, $urlRouterProvider, $compileProvider) {
    "ngInject";
    $urlRouterProvider.otherwise('/');
    $stateProvider
        .state('login', {
            template: '<login></login>',
            url: '/',
            controller: AppController,
            controllerAs: 'mc'
        })
        .state('root', {
            url: '/home',
            template: require('./components/home/home.html'),
            controller: AppController,
            controllerAs: 'mc'
        });
}



function AppController($http, DocumentService, SettingsFactory, $state) {
    var mc = this;

    mc.settings = SettingsFactory.get();

    mc.addOpenGatepass = function (gatepass) {
        gatepass.transaction_date = moment(mc.workingDate).format('YYYY-MM-DD');
        gatepass.warehouse = mc.warehouse.value;
        gatepass.posting_date = gatepass.transaction_date;

        return $http({
            method: 'POST',
            url: SettingsFactory.getERPServerBaseUrl() + '/api/method/flows.flows.doctype.vehicle_trip.vehicle_trip.create_trip',
            data: $.param({
                gatepass: JSON.stringify(gatepass),
                sid: SettingsFactory.getSid()
            })
        }).then(function successCallback(response) {
            mc.openGatepassList.splice(0, 0, response.data.message.open[0]);
        }, function errorCallback(response) {
            console.log(response);
        });
    };

    mc.removeOpenGatepass = function (index) {
        mc.openGatepassList.splice(index, 1);
    };

    mc.addClosedGatepass = function (gatepass) {
        gatepass.transaction_date = moment(mc.workingDate).format('YYYY-MM-DD');
        gatepass.warehouse = mc.warehouse.value;
        gatepass.posting_date = gatepass.transaction_date;

        return $http({
            method: 'POST',
            url: SettingsFactory.getERPServerBaseUrl() + '/api/method/flows.flows.doctype.vehicle_trip.vehicle_trip.create_trip_return',
            data: $.param({
                gatepass: JSON.stringify(gatepass),
                sid: SettingsFactory.getSid()
            })
        }).then(function successCallback(response) {
            var tripIndex = -1;
            angular.forEach(mc.openGatepassList, function (trip, index) {
                if (trip.name === gatepass.trip_id) {
                    tripIndex = index;
                }
            });
            mc.openGatepassList.splice(tripIndex, 1);
            mc.closedGatepassList.splice(0, 0, response.data.message.closed[0]);

        }, function errorCallback(response) {
            console.log(response);
        });

    };


    mc.onRefresh = function (trip_id) {
        return $http.get(SettingsFactory.getERPServerBaseUrl() + "/api/method/flows.flows.doctype.vehicle_trip.vehicle_trip.get_trip_page?name=" + trip_id + "&sid=" + SettingsFactory.getSid())
            .then(function (data) {
                console.log(data.data.message.open[0]);
                var tripIndex = -1;
                angular.forEach(mc.openGatepassList, function (trip, index) {
                    if (trip.name === trip_id) {
                        tripIndex = index;
                    }
                });
                mc.openGatepassList.splice(tripIndex, 1, (data.data.message.open || data.data.message.open)[0]);
                return (data.data.message.open || data.data.message.open)[0];
            });
    };

    mc.closedGatepassList = [];
    mc.openGatepassList = [];
    mc.notificationsList = [];



    mc.searchWarehouse = function (query) {
        return DocumentService.search('Warehouse', query, {}).then(function (data) {
            return data.data.results;
        });
    };


    // on date change
    mc.onDateChange = function () {
        var date = moment(mc.workingDate).format('YYYY-MM-DD');
        $http.get(SettingsFactory.getERPServerBaseUrl() + "/api/method/flows.flows.doctype.vehicle_trip.vehicle_trip.get_trip_page?from_date=" + date + "&to_date=" + date + "&sid=" + SettingsFactory.getSid())
            .then(function (data) {
                mc.openGatepassList = data.data.message.open;
                mc.closedGatepassList = data.data.message.closed;
                mc.notificationsList = data.data.message.notifications;
            });
    };

    mc.onDateChange();

    mc.logout = () => {
        var settings = SettingsFactory.get();
        settings.sid = '';
        SettingsFactory.set(settings);
        $state.go('login');
    };


}

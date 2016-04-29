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
    .config(($locationProvider) => {
        "ngInject";
    })

.config(stateConfig)

.config(function ($mdDateLocaleProvider) {
    $mdDateLocaleProvider.formatDate = function (date) {
        return moment(date).format('DD-MM-YYYY');
    };
})

.config(function ($httpProvider) {
    $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
})

.factory('DocumentService', function ($http) {
    var factory = {
        search: function (documentType, query, filters) {
            var data = {
                txt: query,
                doctype: documentType,
                cmd: 'frappe.widgets.search.search_link',
                _type: 'GET',
                filters: JSON.stringify(filters),
                sid: "d241ed64bec6746fccb95918478fc1cec1b35d92e754186f947f590e"
            };
            var url = 'http://192.168.31.124:8080' + '?' + $.param(data);
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
                    sid: SessionService.getToken(),
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
    $stateProvider.state('root', {
        template: require('./components/home/home.html'),
        url: '/',
        controller: AppController,
        controllerAs: 'mc'
    });
}



function AppController($http, DocumentService) {
    var mc = this;

    mc.addOpenGatepass = function (gatepass) {
        gatepass.transaction_date = moment(mc.workingDate).format('YYYY-MM-DD');
        gatepass.warehouse = mc.warehouse.value;
        gatepass.posting_date = gatepass.transaction_date;

        $http({
            method: 'POST',
            url: 'http://192.168.31.124:8080/api/method/flows.flows.doctype.vehicle_trip.vehicle_trip.create_trip',
            data: $.param({
                gatepass: JSON.stringify(gatepass),
                sid: "d241ed64bec6746fccb95918478fc1cec1b35d92e754186f947f590e"
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
            url: 'http://192.168.31.124:8080/api/method/flows.flows.doctype.vehicle_trip.vehicle_trip.create_trip_return',
            data: $.param({
                gatepass: JSON.stringify(gatepass),
                sid: "d241ed64bec6746fccb95918478fc1cec1b35d92e754186f947f590e"
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
        return $http.get("http://192.168.31.124:8080/api/method/flows.flows.doctype.vehicle_trip.vehicle_trip.get_trip_page?name=" + trip_id)
            .then(function (data) {
                console.log(data.data.message.open[0]);
                var tripIndex = -1;
                angular.forEach(mc.openGatepassList, function (trip, index) {
                    if (trip.name === trip_id) {
                        tripIndex = index;
                    }
                });
                mc.openGatepassList.splice(tripIndex, 1, data.data.message.open[0]);
                return data.data.message.open[0];
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
        $http.get("http://192.168.31.124:8080/api/method/flows.flows.doctype.vehicle_trip.vehicle_trip.get_trip_page?from_date=" + date + "&to_date=" + date + "&sid=d241ed64bec6746fccb95918478fc1cec1b35d92e754186f947f590e")
            .then(function (data) {
                mc.openGatepassList = data.data.message.open;
                mc.closedGatepassList = data.data.message.closed;
                mc.notificationsList = data.data.message.notifications;
            });
    };

    mc.onDateChange();


}

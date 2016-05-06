webpackJsonp([0],[
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	stateConfig.$inject = ["$stateProvider", "$urlRouterProvider", "$compileProvider"];
	AppController.$inject = ["$http", "DocumentService", "SettingsFactory", "$state"];
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	var _angular = __webpack_require__(1);
	
	var _angular2 = _interopRequireDefault(_angular);
	
	var _angularUiRouter = __webpack_require__(3);
	
	var _angularUiRouter2 = _interopRequireDefault(_angularUiRouter);
	
	__webpack_require__(4);
	
	var _componentsComponents = __webpack_require__(8);
	
	var _componentsComponents2 = _interopRequireDefault(_componentsComponents);
	
	__webpack_require__(47);
	
	_angular2['default'].module('app', [_angularUiRouter2['default'], 'ngMaterial', 'ngMdIcons', _componentsComponents2['default'].name]).config(stateConfig).config(["$mdDateLocaleProvider", function ($mdDateLocaleProvider) {
	    "ngInject";
	    $mdDateLocaleProvider.formatDate = function (date) {
	        return moment(date).format('DD-MM-YYYY');
	    };
	}]).config(["$httpProvider", function ($httpProvider) {
	    "ngInject";
	    $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
	    $httpProvider.defaults.headers.post['X-Requested-With'] = 'XMLHttpRequest';
	}]).run(["$rootScope", "$state", function ($rootScope, $state) {
	    "ngInject";
	    $rootScope.$on('login:success', function () {
	        $state.go('root');
	    });
	}])
	
	// UA & Error Interceptor
	.config(["$httpProvider", function ($httpProvider) {
	    "ngInject";
	    var popUp = null;
	    $httpProvider.interceptors.push(["$injector", "$q", function ($injector, $q) {
	        return {
	            responseError: function responseError(rejection) {
	                var stat = rejection.status;
	                var msg = '';
	
	                // Solve circular dependency
	                var $mdDialog = $injector.get('$mdDialog');
	
	                console.log(rejection);
	
	                // ERP specific error extraction
	                if (rejection.data && rejection.data.message) msg = rejection.data.message;else if (rejection.data && rejection.data._server_messages) msg = JSON.parse(rejection.data._server_messages).join('\n');
	
	                // Generic error extraction
	                else if (stat == 403) {
	                        //                    var SessionService = $injector.get('SessionService');
	                        msg = 'Login Required';
	                        //                    $timeout(function () {
	                        //                        SessionService.logout();
	                        //                    }, 0);
	                    } else if (stat == 500) msg = 'Internal Server Error';else if (stat == 501) msg = 'Server Error';else if (stat == 502) msg = 'Server is Offline';else if (stat == 503) msg = 'Server is Overload or down';else if (stat == 504) msg = 'Server is Offline';
	
	                if (msg !== '') $mdDialog.show($mdDialog.alert().parent(_angular2['default'].element(document.querySelector('#popuperror'))).clickOutsideToClose(true).title('Error').textContent(msg).ariaLabel('Alert Dialog Demo').ok('OK'));
	
	                return $q.reject(rejection);
	            }
	        };
	    }]);
	}]).factory('DocumentService', function ($http, SettingsFactory) {
	    var factory = {
	        search: function search(documentType, query, filters) {
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
	        create: function create(documentType, document, review) {
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
	    $stateProvider.state('login', {
	        template: '<login></login>',
	        url: '/',
	        controller: AppController,
	        controllerAs: 'mc'
	    }).state('root', {
	        url: '/home',
	        template: __webpack_require__(50),
	        controller: AppController,
	        controllerAs: 'mc'
	    });
	}
	
	function AppController($http, DocumentService, SettingsFactory, $state) {
	    "ngInject";
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
	            _angular2['default'].forEach(mc.openGatepassList, function (trip, index) {
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
	        return $http.get(SettingsFactory.getERPServerBaseUrl() + "/api/method/flows.flows.doctype.vehicle_trip.vehicle_trip.get_trip_page?name=" + trip_id + "&sid=" + SettingsFactory.getSid()).then(function (data) {
	            console.log(data.data.message.open[0]);
	            var tripIndex = -1;
	            _angular2['default'].forEach(mc.openGatepassList, function (trip, index) {
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
	        $http.get(SettingsFactory.getERPServerBaseUrl() + "/api/method/flows.flows.doctype.vehicle_trip.vehicle_trip.get_trip_page?from_date=" + date + "&to_date=" + date + "&sid=" + SettingsFactory.getSid()).then(function (data) {
	            mc.openGatepassList = data.data.message.open;
	            mc.closedGatepassList = data.data.message.closed;
	            mc.notificationsList = data.data.message.notifications;
	        });
	    };
	
	    mc.onDateChange();
	
	    mc.logout = function () {
	        var settings = SettingsFactory.get();
	        settings.sid = '';
	        SettingsFactory.set(settings);
	        $state.go('login');
	    };
	}

/***/ },
/* 1 */,
/* 2 */,
/* 3 */,
/* 4 */,
/* 5 */,
/* 6 */,
/* 7 */,
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	    value: true
	});
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	var _angular = __webpack_require__(1);
	
	var _angular2 = _interopRequireDefault(_angular);
	
	var _openGatepassOpenGatepass = __webpack_require__(9);
	
	var _openGatepassOpenGatepass2 = _interopRequireDefault(_openGatepassOpenGatepass);
	
	var _newVoucherNewVoucher = __webpack_require__(15);
	
	var _newVoucherNewVoucher2 = _interopRequireDefault(_newVoucherNewVoucher);
	
	var _expenseExpense = __webpack_require__(21);
	
	var _expenseExpense2 = _interopRequireDefault(_expenseExpense);
	
	var _pumpFormPumpForm = __webpack_require__(27);
	
	var _pumpFormPumpForm2 = _interopRequireDefault(_pumpFormPumpForm);
	
	var _pumpViewPumpView = __webpack_require__(33);
	
	var _pumpViewPumpView2 = _interopRequireDefault(_pumpViewPumpView);
	
	var _loginLogin = __webpack_require__(39);
	
	var _loginLogin2 = _interopRequireDefault(_loginLogin);
	
	var componentModule = _angular2['default'].module('app.components', [_openGatepassOpenGatepass2['default'].name, _newVoucherNewVoucher2['default'].name, _expenseExpense2['default'].name, _pumpFormPumpForm2['default'].name, _pumpViewPumpView2['default'].name, _loginLogin2['default'].name]);
	
	exports['default'] = componentModule;
	module.exports = exports['default'];

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	    value: true
	});
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	var _angular = __webpack_require__(1);
	
	var _angular2 = _interopRequireDefault(_angular);
	
	var _angularUiRouter = __webpack_require__(3);
	
	var _angularUiRouter2 = _interopRequireDefault(_angularUiRouter);
	
	var _openGatepassComponent = __webpack_require__(10);
	
	var _openGatepassComponent2 = _interopRequireDefault(_openGatepassComponent);
	
	var gatepassModule = _angular2['default'].module('openGatepass', ['ngMaterial', 'ngMessages', 'material.svgAssetsCache']).component('openGatepass', _openGatepassComponent2['default']);
	
	exports['default'] = gatepassModule;
	module.exports = exports['default'];

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	    value: true
	});
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	var _openGatepassHtml = __webpack_require__(11);
	
	var _openGatepassHtml2 = _interopRequireDefault(_openGatepassHtml);
	
	var _openGatepassController = __webpack_require__(12);
	
	var _openGatepassController2 = _interopRequireDefault(_openGatepassController);
	
	__webpack_require__(13);
	
	var openGatepassComponent = {
	    restrict: 'E',
	    bindings: {
	        gatepass: '=',
	        disabled: '=',
	        onSubmit: '&',
	        onRefresh: '&'
	    },
	    template: _openGatepassHtml2['default'],
	    controller: _openGatepassController2['default'],
	    controllerAs: 'vm'
	};
	
	exports['default'] = openGatepassComponent;
	module.exports = exports['default'];

/***/ },
/* 11 */
/***/ function(module, exports) {

	module.exports = "<!-- USING ROW FOR DESKTOP AND COLUMN FOR MOBILE DEVICES -->\n<md-card class=\"c_shadow_none\">\n    <!-- submit button -->\n    <div class=\"submit_button l-grey\">\n        <button class=\"refresh_icon\" ng-click=\"vm.refresh()\"><i class=\"ion-refresh\"></i></button>\n        <p>{{vm.gatepass.name}} / {{vm.gatepass.out_gatepass}}</p>\n        <button class=\" md-button black\" type=\"button\" ng-click=\"vm.submit()\"><span class=\"ng-scope\" ng-disabled=\"vm.disabled\">Submit</span>\n            <div class=\"md-ripple-container\"></div>\n        </button>\n    </div>\n</md-card>\n<!-- submit button -->\n<md-card class=\"layout-padding c_shadow_none  listblock_dtl\">\n    <div class=\"row \">\n        <!-- open gatepass col1 start here -->\n        <div class=\"column col-3\" flex=\"33\">\n            <div layout=\"row\" layout-margin layout-fill class=\"md-block gd1_left listblock_dtl1\">\n                <div>\n                    <div class=\"input_group \">\n                        <label for=\"vehicle_no \"><i class=\"ion-android-bus \"></i>vehicle No :</label>\n                        <p>{{ vm.gatepass.outGatepass.vehicle }}</p>\n                    </div>\n                    <div class=\"input_group \">\n                        <label for=\"driver \"><i class=\"ion-android-person \"></i>Driver :</label>\n                        <p>{{ vm.gatepass.outGatepass.driver }}</p>\n                    </div>\n                    <div class=\"input_group mat_list\">\n                        <label for=\"driver \"><i class=\"ion-settings \"></i>Material :</label>\n                        <div class=\"gatepass_items\">\n                            <p ng-repeat=\"item in vm.gatepass.outGatepass.items\">{{ item.item }}: {{ item.quantity }}</p>\n                        </div>\n                    </div>\n                </div>\n            </div>\n            <!-- pump detail start here -->\n            <div layout=\"row\" ng-hide=\"!mc.isCollapsed\" class=\"opengatepass_row2\">\n                <pump-view gatepass=\"vm.gatepass.outGatepass\"></pump-view>\n            </div>\n            <!-- pump detail end here -->\n        </div>\n        <!-- open gate col2 start here -->\n        <div class=\"column col-3 open-col-2\">\n            <div layout=\"row\" layout-margin layout-fill class=\"list_block border-left pd_l20\">\n                <ul class=\"item_detail\" ng-class=\"{collaps: editorEnabled}\">\n                    <li ng-repeat=\"txn in vm.gatepass.transactions\"><strong>{{txn.customer}}</strong> {{txn.name}} &nbsp - &nbsp {{txn.item_delivered}}({{txn.delivered_quantity}}) &nbsp/&nbsp {{txn.item_received}}({{txn.received_quantity}})</li>\n                </ul>\n            </div>\n            <div layout=\"row\" layout-margin layout-fill class=\"list_block border-left pd_l25\"></div>\n        </div>\n        <div class=\"column col-3 open-col-3\">\n            <div class=\"opening_stock_dtl\">\n\n                <ul ng-class=\"item.css\" ng-repeat=\"item in vm.gatepass.closingCalculations\">\n                    <li>{{item.name}} </li>\n                    <li>{{item.opening || 0}}</li>\n                    <li>- {{item.out || 0}}</li>\n                    <li>+ {{item.in || 0}}</li>\n                    <li><span ng-class=\"item.closing < 0? 'red_text bold':'' \">{{item.closing}}</span></li>\n                </ul>\n\n            </div>\n            <div layout=\"row\" layout-margin layout-fill class=\"list_block  pd_l20 mat_list\" ng-init=\"vm.gatepass.inGatepass={}\"></div>\n            <div layout=\"row\" layout-fill class=\"list_block  pd_l20 exapand_block\">\n                <div layout=\"row\" ng-hide=\"!mc.isCollapsed\" class=\"opengatepass_row2\">\n                    <pump-form gatepass=\"vm.gatepass.inGatepass\"></pump-form>\n                </div>\n            </div>\n        </div>\n    </div>\n</md-card>\n<!-- good wills info  block start-->\n<md-card class=\"c_shadow_none viwe_more_card \" ng-click=\"mc.isCollapsed=!mc.isCollapsed \" ng-init=\"ClickToEditCtrl=true \">\n    <!-- submit button -->\n    <div class=\" view_more \" ng-class=\"{collaps: editorEnabled}\">\n        <div ng-hide=\" editorEnabled \">\n            <p href=\"# \" ng-click=\"editorEnabled=!editorEnabled \">View More</p>\n        </div>\n        <div ng-show=\"editorEnabled \">\n            <p href=\"# \" ng-click=\"editorEnabled=!editorEnabled \">View Less</p>\n        </div> <i class=\"icon accordian_icon \" ng-class=\"mc.isCollapsed ? 'ion-ios-minus-outline' : 'ion-android-add-circle ' \"></i> </div>\n</md-card>\n<!-- good wills info  block end -->\n"

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	    value: true
	});
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }
	
	var _angular = __webpack_require__(1);
	
	var _angular2 = _interopRequireDefault(_angular);
	
	/*@ngInject*/
	
	var OpenGatepassController = function OpenGatepassController($scope, $mdDialog, $mdMedia, $timeout) {
	    _classCallCheck(this, OpenGatepassController);
	
	    var vm = this;
	    vm.itemDetails = [];
	    this.showAdvanced = function (ev) {
	        $mdDialog.show({
	            templateUrl: './app/components/expense/expense.html',
	            parent: _angular2['default'].element(document.body),
	            targetEvent: ev,
	            clickOutsideToClose: true
	        });
	    };
	
	    vm.openningStock = {};
	    _angular2['default'].forEach(vm.gatepass.outGatepass.items, function (value, index) {
	        vm.openningStock[value.item] = value.quantity;
	    });
	
	    function resetGrTotal() {
	        vm.grTotal = {
	            "item_delivered": {},
	            "item_received": {}
	        };
	    }
	
	    vm.addRow = function () {
	        vm.gatepass.transactions.push({
	            "creation": "2016-04-16 13:14:15.274965",
	            "doctype": "Goods Receipt",
	            "owner": "Administrator",
	            "delivered_quantity": 10,
	            "item_delivered": "FC47.5",
	            "residue": 0,
	            "modified_by": "Administrator",
	            "posting_time": "13:14:15.274844",
	            "location_longitude": "75.8725",
	            "transaction_date": "2016-04-16",
	            "vehicle": "PB10FF5964",
	            "warehouse": "Radhey Shaym - AL",
	            "docstatus": 1,
	            "received_quantity": 10,
	            "customer_image": "/files/GR-16-38_customer.jpg",
	            "delivery_type": "Refill",
	            "company": "Arun Logistics",
	            "signature": "/files/GR-16-38_signature.jpg",
	            "location_latitude": "30.8977764",
	            "excess": 0,
	            "remarks": "\n",
	            "item_received": "EC47.5",
	            "customer": "BHOGAL SALES CORPORATION",
	            "goods_receipt_number": "",
	            "short": 0,
	            "name": "GR-16-38",
	            "customer_document_id": "0",
	            "modified": "2016-04-16 13:14:15.274965",
	            "is_opening": 0,
	            "cancelled": 0,
	            "posting_date": "2016-04-16"
	        });
	        calculate();
	
	        //            $timeout(vm.addRow, 10 * 1000);
	    };
	
	    function calculate() {
	        resetGrTotal();
	
	        if (vm.gatepass.transactions) _angular2['default'].forEach(vm.gatepass.transactions, function (value, index) {
	            vm.grTotal.item_delivered[value.item_delivered] = vm.grTotal.item_delivered[value.item_delivered] || 0;
	            vm.grTotal.item_received[value.item_received] = vm.grTotal.item_received[value.item_received] || 0;
	            vm.grTotal.item_delivered[value.item_delivered] += value.delivered_quantity;
	            vm.grTotal.item_received[value.item_received] += value.received_quantity;
	        });
	
	        vm.gatepass.closingStock = {};
	
	        _angular2['default'].forEach(vm.grTotal.item_delivered, function (qty, item) {
	            if (item) {
	                vm.gatepass.closingStock[item] = vm.openningStock[item] || 0;
	                vm.gatepass.closingStock[item] -= qty;
	            }
	        });
	
	        _angular2['default'].forEach(vm.grTotal.item_received, function (qty, item) {
	            if (item) {
	                vm.gatepass.closingStock[item] = vm.openningStock[item] || 0;
	                vm.gatepass.closingStock[item] += qty;
	            }
	        });
	
	        _angular2['default'].forEach(vm.openningStock, function (qty, item) {
	            if (Object.keys(vm.gatepass.closingStock).indexOf(item) == -1) {
	                vm.gatepass.closingStock[item] = qty;
	            }
	        });
	
	        vm.gatepass.closingCalculations = [];
	        _angular2['default'].forEach(vm.openningStock, function (qty, item) {
	            vm.gatepass.closingCalculations.push({
	                name: item,
	                opening: vm.openningStock[item],
	                out: vm.grTotal.item_delivered[item],
	                'in': vm.grTotal.item_received[item],
	                closing: qty
	            });
	        });
	
	        vm.gatepass.closingCalculations.sort(function (item1, item2) {
	            var baseItem1 = item1.name.replace('FC', '').replace('EC', '').replace('L', '');
	            var baseItem2 = item2.name.replace('FC', '').replace('EC', '').replace('L', '');
	
	            if (baseItem1 == baseItem2) {
	                if (item1.name.indexOf('FC') > -1) return -1;
	                return 1;
	            }
	
	            return parseFloat(baseItem1) - parseFloat(baseItem2);
	        });
	
	        var lastBaseItem = null;
	        _angular2['default'].forEach(vm.gatepass.closingCalculations, function (item, index) {
	            item.css = '';
	            var baseItem = item.name.replace('FC', '').replace('EC', '');
	            if (baseItem !== lastBaseItem) item.css += ' filleditem';else item.css += ' emptyitem';
	            lastBaseItem = baseItem;
	        });
	
	        for (var i = 0; i < vm.gatepass.closingCalculations.length - 1; i++) {
	            // Create Css Pairs
	            var item1 = vm.gatepass.closingCalculations[i];
	            var item2 = vm.gatepass.closingCalculations[i + 1];
	            var baseItem1 = item1.name.replace('FC', '').replace('EC', '');
	            var baseItem2 = item2.name.replace('FC', '').replace('EC', '');
	            if (baseItem1 == baseItem2) {
	                item1.css += ' item_pair';
	                item2.css += ' item_pair';
	            }
	        }
	    }
	
	    calculate();
	
	    if (!this.disabled) {
	        //vm.addRow();
	        //$timeout(vm.addRow, 10 * 1000);
	    }
	
	    vm.refresh = function () {
	        vm.onRefresh({
	            tripid: vm.gatepass.name
	        }).then(function (data) {
	            vm.gatepass = data;
	            calculate();
	        });
	    };
	
	    vm.submit = function () {
	        var gatepass = _angular2['default'].copy(vm.gatepass.inGatepass);
	
	        {
	            (function () {
	                var rs = [];
	                _angular2['default'].forEach(vm.gatepass.closingStock, function (value, key) {
	                    rs.push({
	                        item: key,
	                        quantity: value
	                    });
	                });
	
	                gatepass.items = rs;
	            })();
	        }
	
	        if (gatepass.fuel_pump) {
	            gatepass.fuel_pump = gatepass.fuel_pump.value;
	        }
	
	        gatepass.vehicle = vm.gatepass.outGatepass.vehicle;
	        gatepass.driver = vm.gatepass.outGatepass.driver;
	        gatepass.trip_id = vm.gatepass.name;
	
	        vm.onSubmit({
	            gatepass: gatepass
	        });
	    };
	};
	OpenGatepassController.$inject = ["$scope", "$mdDialog", "$mdMedia", "$timeout"];
	
	exports['default'] = OpenGatepassController;
	module.exports = exports['default'];

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag
	
	// load the styles
	var content = __webpack_require__(14);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(7)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../../../node_modules/css-loader/index.js!./../../../../node_modules/sass-loader/index.js!./open-gatepass.scss", function() {
				var newContent = require("!!./../../../../node_modules/css-loader/index.js!./../../../../node_modules/sass-loader/index.js!./open-gatepass.scss");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(6)();
	// imports
	
	
	// module
	exports.push([module.id, "/************* open-gatepass style *************** */\n.border_left {\n  border-left: 1px solid #ccc; }\n\n#expense_model {\n  background: #f3f3f3;\n  position: fixed;\n  top: 82px;\n  width: 60%;\n  left: 28px;\n  padding: 15px 0 15px 10px;\n  border: 1px solid #ccc;\n  right: 0;\n  left: 0;\n  margin: 0 auto; }\n  #expense_model .input_group {\n    padding-bottom: 0;\n    margin: 0px; }\n    #expense_model .input_group input {\n      font-size: 12px;\n      font-weight: 400; }\n    #expense_model .input_group p {\n      margin-top: 0px !important; }\n  #expense_model .input_block {\n    padding: 5px 10px;\n    position: relative; }\n    #expense_model .input_block textarea {\n      font-size: 12px;\n      height: 40px;\n      width: 200px;\n      border: 1px solid #e1e1e1;\n      padding: 10px 8px; }\n    #expense_model .input_block .m_input .input_group {\n      margin: 0 5px 10px 0; }\n  #expense_model .total_block {\n    border-top: 1px solid #ccc;\n    padding: 20px 10px 5px 10px;\n    margin-top: 10px; }\n  #expense_model .border_left {\n    margin-left: 20px; }\n  #expense_model .o_rightsidebar {\n    padding: 0 20px;\n    margin-left: 15px; }\n    #expense_model .o_rightsidebar .input_group {\n      display: block;\n      width: 100%; }\n      #expense_model .o_rightsidebar .input_group label {\n        float: left;\n        margin-top: 10px; }\n      #expense_model .o_rightsidebar .input_group md-autocomplete {\n        display: inline-block;\n        margin: 0px 0 0 5px;\n        border: 1px solid #e1e1e1;\n        padding: 0;\n        width: 185px;\n        background: #fff; }\n        #expense_model .o_rightsidebar .input_group md-autocomplete md-autocomplete-wrap {\n          box-shadow: none !important; }\n        #expense_model .o_rightsidebar .input_group md-autocomplete input {\n          border: 0; }\n      #expense_model .o_rightsidebar .input_group input {\n        display: inline-block;\n        margin: 0px 0 0 5px;\n        border: 1px solid #e1e1e1;\n        padding: 0 10px;\n        width: 170px;\n        background: #fff;\n        height: 40px; }\n  #expense_model .repeat_row .add_row {\n    position: absolute;\n    right: 110px;\n    top: 5px; }\n  #expense_model .repeat_row_outer {\n    position: absolute;\n    top: 47px;\n    z-index: 2;\n    left: 0;\n    width: 100%;\n    background: #f3f3f3;\n    padding: 0px 0 15px 0; }\n    #expense_model .repeat_row_outer .repeat_row {\n      margin-left: 236px;\n      position: relative; }\n      #expense_model .repeat_row_outer .repeat_row .input_group {\n        margin-right: 5px;\n        padding: 5px 0; }\n  #expense_model .submit_button button {\n    margin-top: 20px;\n    display: inline-block; }\n\n.opengatepass_row2 .label_96 label {\n  width: 75px !important; }\n\n.opengatepass_row2 .input_group {\n  margin-bottom: 10px; }\n  .opengatepass_row2 .input_group p {\n    margin: 0 !important; }\n\n.expanse_conatiner {\n  position: relative; }\n\ninput[type=\"date\"]::-webkit-inner-spin-button {\n  -webkit-appearance: none; }\n\nopen-gatepass .pd_l35 {\n  padding-left: 35px !important; }\n\n.expanse_row .list_block {\n  width: 105.3% !important;\n  max-width: 450px !important; }\n\n.list_block ul {\n  margin: 0; }\n\n.exapand_block .input_group input {\n  max-width: 100px;\n  margin-bottom: 10px;\n  font-size: 14px; }\n\n.exapand_block .md-block {\n  margin: 10px 0; }\n\n.full_width {\n  width: 100%;\n  display: block; }\n\n.full_width input {\n  max-width: 100% !important; }\n\n.full_width label {\n  width: 65px; }\n\n.item_detail {\n  height: 125px;\n  overflow-y: scroll;\n  width: 100%; }\n  .item_detail strong {\n    display: block;\n    margin: 2px 0; }\n\nli h4 {\n  margin: 0; }\n\n.pd_l25 {\n  padding-left: 25px !important;\n  display: inline-block; }\n\n.openingstock_items td {\n  font-family: monospace;\n  font-size: 16px;\n  flex: none;\n  display: inline-block;\n  width: 17%;\n  padding-left: 30px; }\n\n.gatepass_items {\n  float: left;\n  width: 240px;\n  flex: none;\n  display: inline-block; }\n\n.opening_stock_dtl {\n  padding-left: 20px; }\n  .opening_stock_dtl ul {\n    display: inline-block;\n    float: left;\n    width: 60px;\n    margin: 0 0 20px 0;\n    padding: 10px 5px;\n    border: 1px solid #ccc; }\n    .opening_stock_dtl ul li {\n      list-style: none;\n      text-align: right;\n      font-family: monospace;\n      font-size: 16px;\n      padding-right: 10px; }\n      .opening_stock_dtl ul li:first-child {\n        font-size: 14px;\n        font-weight: bold;\n        color: red;\n        text-align: center;\n        width: 70px; }\n      .opening_stock_dtl ul li:last-child {\n        border-top: 1px solid #ccc; }\n\n.emptyitem {\n  margin-right: 20px !important; }\n  .emptyitem.item_pair {\n    margin: 0px 10px 10px 0px !important;\n    border-left: 0; }\n\n.filleditem {\n  margin-right: 10px !important; }\n  .filleditem.item_pair {\n    margin: 0px 0 0px 0 !important;\n    border-right: 0; }\n", ""]);
	
	// exports


/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	    value: true
	});
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	var _angular = __webpack_require__(1);
	
	var _angular2 = _interopRequireDefault(_angular);
	
	var _angularUiRouter = __webpack_require__(3);
	
	var _angularUiRouter2 = _interopRequireDefault(_angularUiRouter);
	
	var _newVoucherComponent = __webpack_require__(16);
	
	var _newVoucherComponent2 = _interopRequireDefault(_newVoucherComponent);
	
	var newVoucherModule = _angular2['default'].module('newVoucherComponent', []).component('newVoucher', _newVoucherComponent2['default']);
	
	exports['default'] = newVoucherModule;
	module.exports = exports['default'];

/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	    value: true
	});
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	var _newVoucherHtml = __webpack_require__(17);
	
	var _newVoucherHtml2 = _interopRequireDefault(_newVoucherHtml);
	
	var _newVoucherControllerJs = __webpack_require__(18);
	
	var _newVoucherControllerJs2 = _interopRequireDefault(_newVoucherControllerJs);
	
	__webpack_require__(19);
	
	var newVoucherComponent = {
	    restrict: 'E',
	    bindings: {
	        onCreation: '&'
	    },
	    template: _newVoucherHtml2['default'],
	    controller: _newVoucherControllerJs2['default'],
	    controllerAs: 'nvc'
	};
	
	exports['default'] = newVoucherComponent;
	module.exports = exports['default'];

/***/ },
/* 17 */
/***/ function(module, exports) {

	module.exports = "<!-- USING ROW FOR DESKTOP AND COLUMN FOR MOBILE DEVICES -->\n<form ng-submit=\"voucherSubmit()\" ng-init=\"validation=true\" name=\"newVocherForm\">\n    <md-card class=\"c_shadow_none\">\n        <!-- submit button -->\n        <div class=\"submit_button l-grey\">\n            <button class=\"md-button  black\" type=\"button\" ng-click=\"nvc.submit()\" ng-disabled=\"!newVocherForm.$valid\"><span class=\"ng-scope\">Submit</span>\n                <div class=\"md-ripple-container\"></div>\n            </button>\n        </div>\n    </md-card>\n    <!-- submit button -->\n    <md-card class=\"layout-padding c_shadow_none wrap_contain new_vocher_block\">\n        <p class=\"error_fields\" ng-show=\"newVocherForm.$error.required\"> Fill out required fields </p>\n        <div layout=\"row\" layout-sm=\"column\" flex=\"100\" class=\"detail_block1\">\n            <div class=\"md-block gd1_left pd_t40\" flex=\"50\">\n                <div class=\"input_group\">\n                    <label for=\"vehicle_no \"><i class=\"ion-android-bus \"></i>vehicle No :</label>\n                    <md-autocomplete md-selected-item=\"nvc.gatepass.vehicle\" md-item-text=\"item.value\" md-items=\"item in nvc.searchVehicle(ctrl.txtVehicle)\" md-search-text=\"ctrl.txtVehicle\" md-min-length=\"0\" placeholder=\"Select vehicle\" md-no-cache=\"noCacheResults\" ng-required=\"!nvc.gatepass.vehicle\">\n                        <md-item-templat> <span md-highlight-text=\"ctrl.txtVehicle\" md-highlight-flags=\"^i\">{{item.value}}</span> </md-item-templat>\n                        <md-not-found> No vehicle matching \"{{ctrl.txtVehicle}}\" were found. </md-not-found>\n                    </md-autocomplete>\n                </div>\n                <div class=\"input_group \">\n                    <label for=\"driver \"><i class=\"ion-android-person \"></i>Driver :</label>\n                    <md-autocomplete md-selected-item=\"nvc.gatepass.driver\" md-item-text=\"item.value\" md-items=\"item in nvc.searchDriver(ctrl.txtDriver)\" md-search-text=\"ctrl.txtDriver\" md-min-length=\"0\" placeholder=\"Select driver\" ng-required=\"!nvc.gatepass.driver\">\n                        <md-item-template> <span md-highlight-text=\"ctrl.txtDriver\" md-highlight-flags=\"^i\">{{item.value}}</span> </md-item-template>\n                        <md-not-found> No Driver matching \"{{ctrl.txtDriver}}\" were found. </md-not-found>\n                    </md-autocomplete>\n                    <!--<input name=\"driver\" ng-model=\"nvc.gatepass.driver\"> </div>-->\n                </div>\n            </div>\n            <div class=\"md-block gd1_right\">\n                <h4><i class=\"ion-settings \"></i> Material</h4>\n                <div class=\"input_block input_50\">\n                    <div layout=\"row\" layout-sm=\"column\">\n                        <div class=\"input_group \">\n                            <label class=\"flex-35\" for=\"FC19 \">FC19</label>\n                            <input placeholder=\"FC19\" min=\"0\" type=\"number\" ng-model=\"nvc.gatepass.items.FC19\" name=\"itemsFc19\" ng-required=\"!(nvc.gatepass.items.FC19 || nvc.gatepass.items.FC35 || nvc.gatepass.items.FC47 || nvc.gatepass.items.FC47_5 || nvc.gatepass.items.EC19 || nvc.gatepass.items.EC35 || nvc.gatepass.items.EC47 || nvc.gatepass.items.EC47_5)\" />\n                        </div>\n                        <div class=\"input_group \">\n                            <label class=\"flex-35\" for=\"FC35\">FC35</label>\n                            <input placeholder=\"FC35\" min=\"0\" type=\"number\" ng-model=\"nvc.gatepass.items.FC35\" name=\"itemsFc35\" ng-required=\"!(nvc.gatepass.items.FC19 || nvc.gatepass.items.FC35 || nvc.gatepass.items.FC47 || nvc.gatepass.items.FC47_5 || nvc.gatepass.items.EC19 || nvc.gatepass.items.EC35 || nvc.gatepass.items.EC47 || nvc.gatepass.items.EC47_5)\">\n                        </div>\n                    </div>\n                    <div layout=\"row\" layout-sm=\"column\">\n                        <div class=\"input_group\">\n                            <label class=\" flex-35 \" for=\"FC47 \">FC47.5</label>\n                            <input type=\"number\" placeholder=\"FC47.5\" min=\"0\" ng-model=\"nvc.gatepass.items.FC47\" ng-required=\"!(nvc.gatepass.items.FC19 || nvc.gatepass.items.FC35 || nvc.gatepass.items.FC47 || nvc.gatepass.items.FC47_5 || nvc.gatepass.items.EC19 || nvc.gatepass.items.EC35 || nvc.gatepass.items.EC47 || nvc.gatepass.items.EC47_5)\"> </div>\n                        <div class=\"input_group\">\n                            <label class=\"flex-35\" for=\"FClot47\">FC47.5Lot</label>\n                            <input type=\"number\" placeholder=\"FC47.5Lot\" min=\"0\" ng-model=\" nvc.gatepass.items.FC47_5 \" ng-required=\"!(nvc.gatepass.items.FC19 || nvc.gatepass.items.FC35 || nvc.gatepass.items.FC47 || nvc.gatepass.items.FC47_5 ||nvc.gatepass.items.EC19 || nvc.gatepass.items.EC35 || nvc.gatepass.items.EC47 || nvc.gatepass.items.EC47_5) \">\n                        </div>\n                    </div>\n                </div>\n            </div>\n        </div>\n        <div layout=\"row \" layout-sm=\"column \" flex=\"100 \" class=\"detail_block2 \" ng-hide=\"!nvc.isCollapsed \">\n            <div class=\"gd1_left \" flex=\"50 \" layout-fill=\" \">\n                <pump-form gatepass=\"nvc.gatepass \"></pump-form>\n            </div>\n            <div class=\"md-block gd1_right \">\n                <div class=\"input_block input_50 \">\n                    <div layout=\"row \" layout-sm=\"column \">\n                        <div class=\"input_group \">\n                            <label class=\"flex-35 \">EC19</label>\n                            <input placeholder=\"EC19\" min=\"0\" type=\"number \" ng-model=\"nvc.gatepass.items.EC19 \" ng-required=\"!(nvc.gatepass.items.FC19 || nvc.gatepass.items.FC35 || nvc.gatepass.items.FC47 || nvc.gatepass.items.FC47_5 ||nvc.gatepass.items.EC19 || nvc.gatepass.items.EC35 || nvc.gatepass.items.EC47 || nvc.gatepass.items.EC47_5) \">\n                        </div>\n                        <div class=\"input_group \">\n                            <label class=\"flex-35 \" for=\"FC35 \">EC35</label>\n                            <input placeholder=\"EC35\" min=\"0\" type=\"number \" ng-model=\"nvc.gatepass.items.EC35 \" ng-required=\"!(nvc.gatepass.items.FC19 || nvc.gatepass.items.FC35 || nvc.gatepass.items.FC47 || nvc.gatepass.items.FC47_5 ||nvc.gatepass.items.EC19 || nvc.gatepass.items.EC35 || nvc.gatepass.items.EC47 || nvc.gatepass.items.EC47_5) \">\n                        </div>\n                    </div>\n                    <div layout=\"row \" layout-sm=\"column \">\n                        <div class=\"input_group \">\n                            <label class=\" flex-35 \" for=\"FC47 \">EC47.5</label>\n                            <input type=\"number\" placeholder=\"EC47.5\" min=\"0\" ng-model=\"nvc.gatepass.items.EC47 \" ng-required=\"!(nvc.gatepass.items.FC19 || nvc.gatepass.items.FC35 || nvc.gatepass.items.FC47 || nvc.gatepass.items.FC47_5 ||nvc.gatepass.items.EC19 || nvc.gatepass.items.EC35 || nvc.gatepass.items.EC47 || nvc.gatepass.items.EC47_5) \">\n                        </div>\n                        <div class=\"input_group \">\n                            <label class=\"flex-35 \" for=\"FClot47 \">EC47.5Lot</label>\n                            <input type=\"number \" placeholder=\"EC47.5Lot\" min=\"0\" ng-model=\"nvc.gatepass.items.EC47_5 \" ng-required=\"!(nvc.gatepass.items.FC19 || nvc.gatepass.items.FC35 || nvc.gatepass.items.FC47 || nvc.gatepass.items.FC47_5 ||nvc.gatepass.items.EC19 || nvc.gatepass.items.EC35 || nvc.gatepass.items.EC47 || nvc.gatepass.items.EC47_5) \">\n                        </div>\n                    </div>\n                </div>\n            </div>\n        </div>\n    </md-card>\n    <!-- view more block -->\n    <md-card class=\"c_shadow_none viwe_more_card \" ng-click=\"nvc.isCollapsed=!nvc.isCollapsed \" ng-init=\"ClickToEditCtrl=true \">\n        <!-- submit button -->\n        <div class=\" view_more \">\n            <div ng-hide=\" editorEnabled \">\n                <p href=\"# \" ng-click=\"editorEnabled=!editorEnabled \">View More</p>\n            </div>\n            <div ng-show=\"editorEnabled \">\n                <p href=\"# \" ng-click=\"editorEnabled=!editorEnabled \">View Less</p>\n            </div> <i class=\"icon accordian_icon \" ng-class=\"nvc.isCollapsed ? 'ion-ios-minus-outline' : 'ion-android-add-circle ' \"></i> </div>\n    </md-card>\n</form>\n"

/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	    value: true
	});
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	var _angular = __webpack_require__(1);
	
	var _angular2 = _interopRequireDefault(_angular);
	
	function NewVoucherController(DocumentService, $element) {
	    var vm = this;
	    vm.submit = function () {
	        var gatepass = _angular2['default'].copy(vm.gatepass);
	
	        function getItem(item) {
	            if (item == 'FC47') {
	                return "FC47.5";
	            } else if (item == 'FC47_5') {
	                return "FC47.5L";
	            } else if (item == 'EC47') {
	                return "EC47.5";
	            } else if (item == 'EC47_5') {
	                return "EC47.5L";
	            } else {
	                return item;
	            }
	        };
	        // new items
	
	        var newItems = [];
	        _angular2['default'].forEach(gatepass.items, function (value, key) {
	            newItems.push({
	                "item": getItem(key),
	                "quantity": value
	            });
	        });
	        gatepass.items = newItems;
	
	        if (gatepass.vehicle) gatepass.vehicle = gatepass.vehicle.value;
	        if (gatepass.driver) gatepass.driver = gatepass.driver.value;
	        if (gatepass.fuel_pump) gatepass.fuel_pump = gatepass.fuel_pump.value;
	
	        gatepass.gatepass_type = "Out";
	        gatepass.voucher_type = "ERV";
	        gatepass.company = "Arun Logistics";
	        gatepass.dispatch_destination = "Other";
	
	        vm.onCreation({
	            gatepass: gatepass
	        }).then(function () {
	            var autoComp = $($element).find('md-autocomplete-wrap');
	
	            autoComp.each(function (index, elem) {
	                _angular2['default'].element(elem).scope().$mdAutocompleteCtrl.clear();
	            });
	            vm.gatepass = {};
	        });
	    };
	
	    vm.searchVehicle = function (query) {
	        return DocumentService.search('Transportation Vehicle', query, {}).then(function (data) {
	            return data.data.results;
	        });
	    };
	    vm.searchDriver = function (query) {
	        return DocumentService.search('Driver', query, {}).then(function (data) {
	            return data.data.results;
	        });
	    };
	}
	exports['default'] = NewVoucherController;
	module.exports = exports['default'];

/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag
	
	// load the styles
	var content = __webpack_require__(20);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(7)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../../../node_modules/css-loader/index.js!./../../../../node_modules/sass-loader/index.js!./new-voucher.scss", function() {
				var newContent = require("!!./../../../../node_modules/css-loader/index.js!./../../../../node_modules/sass-loader/index.js!./new-voucher.scss");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(6)();
	// imports
	
	
	// module
	exports.push([module.id, ".gd1_left .input_group {\n  display: inline-block;\n  width: 100%; }\n  .gd1_left .input_group label {\n    float: left; }\n  .gd1_left .input_group input {\n    width: 82px;\n    float: left; }\n\n.gd1_right .input_group label {\n  width: 70px; }\n\n.gd1_right .input_group input {\n  width: 65px;\n  float: right; }\n\nmd-autocomplete {\n  float: left;\n  background: none;\n  border: 1px solid #e1e1e1;\n  box-shadow: none; }\n  md-autocomplete md-autocomplete-wrap {\n    box-shadow: none !important; }\n    md-autocomplete md-autocomplete-wrap input {\n      border: 1px solid #e1e1e1;\n      padding: 0 0 0 10px;\n      height: 30px;\n      font-size: 13px;\n      margin-top: 0 !important;\n      box-shadow: none; }\n\n.reqired_fields p {\n  padding: 0 10px;\n  color: red;\n  font-size: 14px; }\n\ninput[aria-required=\"true\"] {\n  box-shadow: inset 0px 0px 4px red; }\n\nmd-autocomplete[required=\"required\"]:after {\n  content: \"*\";\n  float: right;\n  position: absolute;\n  top: 0;\n  right: -15px;\n  color: red; }\n\n.error_fields {\n  position: absolute;\n  top: -5px;\n  left: 0px;\n  text-align: center;\n  color: red;\n  font-size: 18px; }\n", ""]);
	
	// exports


/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	    value: true
	});
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	var _angular = __webpack_require__(1);
	
	var _angular2 = _interopRequireDefault(_angular);
	
	var _angularUiRouter = __webpack_require__(3);
	
	var _angularUiRouter2 = _interopRequireDefault(_angularUiRouter);
	
	var _expenseComponent = __webpack_require__(22);
	
	var _expenseComponent2 = _interopRequireDefault(_expenseComponent);
	
	var expenseModule = _angular2['default'].module('expenseComponent', []).component('expense', _expenseComponent2['default']);
	exports['default'] = expenseModule;
	module.exports = exports['default'];

/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	    value: true
	});
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	var _expenseHtml = __webpack_require__(23);
	
	var _expenseHtml2 = _interopRequireDefault(_expenseHtml);
	
	__webpack_require__(24);
	
	var _expenseControllerJs = __webpack_require__(26);
	
	var _expenseControllerJs2 = _interopRequireDefault(_expenseControllerJs);
	
	var expenseComponent = {
	    restrict: 'E',
	    bindings: {
	        gatepass: '='
	    },
	    template: _expenseHtml2['default'],
	    controller: _expenseControllerJs2['default'],
	    controllerAs: 'ec'
	};
	
	exports['default'] = expenseComponent;
	module.exports = exports['default'];

/***/ },
/* 23 */
/***/ function(module, exports) {

	module.exports = "<div layout=\"row \" layout-sm=\"column \" flex=\"100 \" class=\"detail_block1 expense_block\">\n    <div class=\"md-block expense_left\">\n        <!-- toll block start here -->\n        <div class=\"input_block input_50 \">\n            <div layout=\"row \" layout-sm=\"column \" class=\"m_input\">\n                <div class=\"input_group left_input\">\n                    <label class=\"flex-25 \" for=\"toll \">Toll</label>\n                    <input class=\"ng-valid md-input ng-touched \" name=\"toll \">\n                </div>\n                <div class=\"repeat_row right_input\" layout=\"row\" layout-sm=\"column\">\n                    <div class=\"repeat_row\" layout=\"row\" layout-sm=\"column\">\n                        <div class=\"add_row\">\n                            <button ng-click=\"ec.addTollList()\">\n                                <i class=\"ion-android-add-circle\"></i>\n                            </button>\n                            <div class=\"tolllist\">\n                                <div class=\"input_group \">\n                                    <input class=\"ng-valid md-input ng-touched \" placeholder=\"Slip-ID\">\n                                </div>\n                                <div class=\"input_group \">\n                                    <input class=\"ng-valid md-input ng-touched \" placeholder=\"Barrier\">\n                                </div>\n                                <div class=\"input_group \">\n                                    <input class=\"ng-valid md-input ng-touched \" placeholder=\"Ammount\">\n                                </div>\n                            </div>\n                        </div>\n                        <div class=\"repeat_row_outer tolllist\" ng-repeat=\"todo in ec.tollListDetail\">\n                            <div class=\"input_group \">\n                                <input class=\"ng-valid md-input ng-touched \" placeholder=\"Slip-ID\">\n                            </div>\n                            <div class=\"input_group \">\n                                <input class=\"ng-valid md-input ng-touched \" placeholder=\"Barrier\">\n                            </div>\n                            <div class=\"input_group \">\n                                <input class=\"ng-valid md-input ng-touched \" placeholder=\"Ammount\">\n                            </div>\n                            <button ng-click=\"ec.delete($index)\" class=\"expense_remove\">\n                                <i class=\"ion-android-remove-circle\"></i>\n                            </button>\n                        </div>\n                    </div>\n\n                </div>\n\n            </div>\n            <!-- toll block end here -->\n\n            <!-- Food block start here -->\n            <div class=\"input_block input_50 textarea_block\">\n                <div layout=\"row \" layout-sm=\"column \">\n                    <div class=\"input_group left_input\">\n                        <label class=\"flex-25 \" for=\"Food \">Food</label>\n                        <input class=\"ng-valid md-input ng-touched \" name=\"Food \">\n                    </div>\n                    <div class=\"input_group right_input\">\n                        <label class=\"flex-25 \" for=\"remarks \">Remarks</label>\n                        <textarea class=\"ng-valid md-input ng-touched \" placeholder=\"Remarks \"></textarea>\n                    </div>\n                </div>\n            </div>\n            <!-- food block end here -->\n\n            <!-- Labour block start here -->\n            <div class=\"input_block input_50 textarea_block\">\n                <div layout=\"row \" layout-sm=\"column \">\n                    <div class=\"input_group left_input\">\n                        <label class=\"flex-25 \" for=\"Labour \">Labour</label>\n                        <input class=\"ng-valid md-input ng-touched \" name=\"Labour \">\n                    </div>\n                    <div class=\"input_group right_input\">\n                        <label class=\"flex-25 \" for=\"remarks \">Remarks</label>\n                        <textarea class=\"ng-valid md-input ng-touched \" placeholder=\"Remarks \"></textarea>\n                    </div>\n                </div>\n            </div>\n            <!-- Labour block end here -->\n\n            <!-- Union block start here -->\n            <div class=\"input_block input_50 textarea_block\">\n                <div layout=\"row \" layout-sm=\"column \">\n                    <div class=\"input_group left_input\">\n                        <label class=\"flex-25 \" for=\"union \">Union</label>\n                        <input class=\"ng-valid md-input ng-touched \">\n                    </div>\n                    <div class=\"input_group right_input\">\n                        <label class=\"flex-25 \" for=\"remarks \">Remarks</label>\n                        <textarea class=\"ng-valid md-input ng-touched \" placeholder=\"Remarks \"></textarea>\n                    </div>\n                </div>\n            </div>\n            <!-- Union block end here -->\n\n            <!-- Sundry block start here -->\n            <div class=\"input_block input_50 textarea_block\">\n                <div layout=\"row \" layout-sm=\"column \">\n                    <div class=\"input_group left_input\">\n                        <label class=\"flex-25 \" for=\"union \">Sundry</label>\n                        <input class=\"ng-valid md-input ng-touched \" name=\"union \">\n                    </div>\n                    <div class=\"input_group right_input\">\n                        <label class=\"flex-25 \" for=\"remarks \">Remarks</label>\n                        <textarea class=\"ng-valid md-input ng-touched \" placeholder=\"Remarks \"></textarea>\n                    </div>\n                </div>\n            </div>\n            <!-- Sundry block end here -->\n            <!-- total block start here -->\n            <div class=\"input_block input_50 total_block textarea_block\">\n                <div layout=\"row \" layout-sm=\"column \">\n                    <div class=\"input_group \">\n                        <label class=\"\" for=\"union \">Total</label>\n                        <input class=\"ng-valid md-input ng-touched \" name=\"total\">\n                    </div>\n\n                </div>\n            </div>\n            <!-- Sundry block end here -->\n        </div>\n    </div>\n    <div class=\"md-block border_left expense_right\">\n        <div class=\"md-block gd1_right o_rightsidebar \">\n            <div class=\"input_block input_50 \">\n                <div layout=\"row \" layout-sm=\"column \">\n                    <div class=\"input_group \">\n                        <label class=\"flex-50 \">Credit Company </label>\n                        <md-autocomplete md-selected-item=\"selectedItem \" md-search-text=\"searchText \" md-items=\"item in getMatches(searchText) \" md-item-text=\"item.display \">\n                            <md-item-template>\n                                <span md-highlight-text=\"searchText \">{{item.display}}</span>\n                            </md-item-template>\n                            <md-not-found>\n                                No matches found.\n                            </md-not-found>\n                        </md-autocomplete>\n\n                    </div>\n\n                </div>\n            </div>\n            <div class=\"input_block input_50 \">\n                <div layout=\"row \" layout-sm=\"column \">\n                    <div class=\"input_group \">\n                        <label class=\"flex-50 \">Credit Account</label>\n                        <md-autocomplete md-selected-item=\"selectedItem \" md-search-text=\"searchText \" md-items=\"item in getMatches(searchText) \" md-item-text=\"item.display \">\n                            <md-item-template>\n                                <span md-highlight-text=\"searchText \">{{item.display}}</span>\n                            </md-item-template>\n                            <md-not-found>\n                                No matches found.\n                            </md-not-found>\n                        </md-autocomplete>\n                    </div>\n\n                </div>\n            </div>\n            <div class=\"input_block input_50 \">\n                <div layout=\"row \" layout-sm=\"column \">\n                    <div class=\"input_group \">\n                        <label class=\"flex-50 \" for=\"credit_date \">Credit Date</label>\n                        <input class=\"ng-valid md-input \" name=\"creditdate \" type=\"date\" placeholder=\"dd-mm-yy\">\n                    </div>\n\n                </div>\n            </div>\n        </div>\n        <div class=\"submit_button l-grey\">\n            <button class=\"md-raised md-button md-ink-ripple black\" type=\"button\" aria-label=\"Button\"><span class=\"ng-scope\">Submit</span>\n                <div class=\"md-ripple-container\"></div>\n            </button>\n            <button class=\"md-raised md-button md-ink-ripple black\" type=\"button\" aria-label=\"Button\"><span class=\"ng-scope\">Cancel</span>\n                <div class=\"md-ripple-container\"></div>\n            </button>\n        </div>\n    </div>\n\n</div>\n"

/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag
	
	// load the styles
	var content = __webpack_require__(25);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(7)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../../../node_modules/css-loader/index.js!./../../../../node_modules/sass-loader/index.js!./expense.scss", function() {
				var newContent = require("!!./../../../../node_modules/css-loader/index.js!./../../../../node_modules/sass-loader/index.js!./expense.scss");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(6)();
	// imports
	
	
	// module
	exports.push([module.id, "/************* open-gatepass style *************** */\n.border_left {\n  border-left: 1px solid #ccc; }\n\nmd-dialog {\n  background: #f3f3f3;\n  padding: 20px;\n  border: 1px solid #ccc;\n  width: 90%;\n  max-width: 1100px;\n  position: relative; }\n  md-dialog .input_group {\n    padding-bottom: 0;\n    margin: 0px; }\n    md-dialog .input_group input {\n      font-size: 12px;\n      font-weight: 400; }\n  md-dialog .expense_left {\n    position: relative; }\n    md-dialog .expense_left label {\n      width: 80px;\n      display: inline-block;\n      font-size: 13px; }\n  md-dialog .input_block {\n    position: relative; }\n    md-dialog .input_block textarea {\n      font-size: 12px;\n      height: 40px;\n      width: 200px;\n      border: 1px solid #e1e1e1;\n      padding: 10px 8px; }\n    md-dialog .input_block .m_input .input_group {\n      margin: 0 5px 10px 0; }\n  md-dialog .border_left {\n    margin-left: 20px; }\n  md-dialog .o_rightsidebar {\n    padding: 0 20px;\n    margin-left: 15px; }\n    md-dialog .o_rightsidebar .input_group {\n      display: block;\n      width: 100%; }\n      md-dialog .o_rightsidebar .input_group label {\n        float: left;\n        margin-top: 10px;\n        font-size: 13px;\n        width: 120px; }\n      md-dialog .o_rightsidebar .input_group md-autocomplete {\n        display: inline-block;\n        margin: 0px 0 0 5px;\n        border: 1px solid #e1e1e1;\n        padding: 0;\n        width: 185px;\n        background: #fff; }\n        md-dialog .o_rightsidebar .input_group md-autocomplete md-autocomplete-wrap {\n          box-shadow: none !important; }\n        md-dialog .o_rightsidebar .input_group md-autocomplete input {\n          border: 0; }\n      md-dialog .o_rightsidebar .input_group input {\n        display: inline-block;\n        margin: 0px 0 0 5px;\n        border: 1px solid #e1e1e1;\n        padding: 0 10px;\n        width: 170px;\n        background: #fff;\n        height: 40px; }\n  md-dialog .repeat_row {\n    display: block;\n    z-index: 38; }\n    md-dialog .repeat_row .add_row {\n      width: 100%;\n      float: left;\n      width: 100%; }\n  md-dialog .repeat_row_outer {\n    float: left;\n    width: 100%;\n    background: #f3f3f3;\n    padding: 0px 0 0px 0; }\n    md-dialog .repeat_row_outer .repeat_row {\n      margin-left: 195px;\n      position: relative; }\n    md-dialog .repeat_row_outer .input_group {\n      margin-right: 5px;\n      padding: 5px 0;\n      display: inline-block; }\n  md-dialog .submit_button {\n    margin-left: 20px; }\n    md-dialog .submit_button button {\n      margin-top: 20px;\n      display: inline-block; }\n  md-dialog .md-raised span {\n    color: #fff; }\n\nmd-dialog .gd1_right {\n  padding: 0; }\n\nmd-dialog .input_group {\n  padding-right: 0 !important; }\n\n.opengatepass_row2 .label_96 label {\n  width: 75px !important; }\n\n.expanse_conatiner {\n  position: relative; }\n\ninput[type=\"date\"]::-webkit-inner-spin-button {\n  -webkit-appearance: none; }\n\nopen-gatepass .pd_l35 {\n  padding-left: 35px !important; }\n\n.expanse_row .list_block {\n  width: 105.3% !important;\n  max-width: 450px !important; }\n\n.list_block ul {\n  margin: 0; }\n\n.add_row {\n  display: block; }\n  .add_row button {\n    background: none;\n    border: none;\n    position: absolute;\n    right: 0px;\n    top: 0px; }\n  .add_row .tolllist {\n    display: block;\n    width: 100%;\n    float: left; }\n  .add_row .input_group {\n    float: left;\n    display: inline-block; }\n\n.expense_remove {\n  float: right;\n  border: none;\n  background: none; }\n\nexpense .expense_left {\n  float: left;\n  width: 65%;\n  box-sizing: border-box; }\n  expense .expense_left .input_group {\n    float: left; }\n    expense .expense_left .input_group:first-child {\n      margin: 0; }\n    expense .expense_left .input_group input {\n      width: 50%; }\n    expense .expense_left .input_group textarea {\n      width: 70%; }\n  expense .expense_left .repeat_row .input_group {\n    width: 24%;\n    margin: 0 25px 10px 0; }\n    expense .expense_left .repeat_row .input_group input {\n      margin-right: 0px;\n      width: 100%; }\n  expense .expense_left .right_input {\n    width: 60%; }\n  expense .expense_left .left_input {\n    width: 40%; }\n  expense .expense_left .repeat_row_outer .input_group {\n    margin-bottom: 0px; }\n\nexpense .expense_right {\n  width: 35%;\n  box-sizing: border-box; }\n  expense .expense_right .input_group {\n    margin-bottom: 10px; }\n    expense .expense_right .input_group input {\n      float: left; }\n\nexpense .input_group label {\n  margin-right: 10px;\n  float: left; }\n\nexpense .input_group input {\n  float: left; }\n\nexpense .input_block {\n  padding: 0; }\n\nexpense .textarea_block {\n  margin: 10px 0; }\n\nexpense .total_block {\n  border-top: 1px solid #ccc;\n  padding: 20px 10px 5px 0px;\n  margin-top: 20px; }\n", ""]);
	
	// exports


/***/ },
/* 26 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	    value: true
	});
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	var _angular = __webpack_require__(1);
	
	var _angular2 = _interopRequireDefault(_angular);
	
	function ExpenseController() {
	    var ec = this;
	
	    // add toll list
	    ec.tollListDetail = [];
	    ec.addTollList = function () {
	        ec.tollListDetail.push({});
	    };
	    // remove toll list
	    ec['delete'] = function (index) {
	        ec.tollListDetail.splice(index, 1);
	    };
	}
	exports['default'] = ExpenseController;
	module.exports = exports['default'];

/***/ },
/* 27 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	    value: true
	});
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	var _angular = __webpack_require__(1);
	
	var _angular2 = _interopRequireDefault(_angular);
	
	var _angularUiRouter = __webpack_require__(3);
	
	var _angularUiRouter2 = _interopRequireDefault(_angularUiRouter);
	
	var _pumpFormComponent = __webpack_require__(28);
	
	var _pumpFormComponent2 = _interopRequireDefault(_pumpFormComponent);
	
	var pumpFormModule = _angular2['default'].module('pumpForm', ['ngMaterial', 'ngMessages', 'material.svgAssetsCache']).component('pumpForm', _pumpFormComponent2['default']);
	
	exports['default'] = pumpFormModule;
	module.exports = exports['default'];

/***/ },
/* 28 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	    value: true
	});
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	var _pumpFormHtml = __webpack_require__(29);
	
	var _pumpFormHtml2 = _interopRequireDefault(_pumpFormHtml);
	
	var _pumpFormController = __webpack_require__(30);
	
	var _pumpFormController2 = _interopRequireDefault(_pumpFormController);
	
	__webpack_require__(31);
	
	var pumpFormComponent = {
	    restrict: 'E',
	    bindings: {
	        gatepass: '='
	    },
	    template: _pumpFormHtml2['default'],
	    controller: _pumpFormController2['default'],
	    controllerAs: 'pfc'
	};
	
	exports['default'] = pumpFormComponent;
	module.exports = exports['default'];

/***/ },
/* 29 */
/***/ function(module, exports) {

	module.exports = "<div class=\"md-block \">\n    <div layout=\"row\">\n        <div class=\"input_group full_width\">\n            <label class=\"flex-17\" for=\"Pump\">Pump</label>\n            <md-autocomplete md-selected-item=\"pfc.gatepass.fuel_pump\" md-item-text=\"item.value\" md-items=\"item in pfc.searchPump(ctrl.txtPump)\" md-search-text=\"ctrl.txtPump\" md-min-length=\"0\" placeholder=\"Select Pump\" ng-required=\"(pfc.gatepass.fuel_pump || pfc.gatepass.mobiloil || pfc.gatepass.fuel_quantity || pfc.gatepass.fuel_slip_id)\">\n                <!--               <md-content ng-show=\"mc.warehouse && mc.warehouse.value != ''\">-->\n                <md-item-template>\n                    <span md-highlight-text=\"ctrl.txtPump\" md-highlight-flags=\"^i\">{{item.value}}</span>\n                </md-item-template>\n                <md-not-found>\n                    No vehicle matching \"{{ctrl.txtPump}}\" were found.\n                </md-not-found>\n            </md-autocomplete>\n        </div>\n    </div>\n    <div layout=\"row\">\n        <div class=\"input_group\">\n            <label class=\"\" for=\"Fuel Id\">Fuel Id </label>\n            <input type=\"text\" ng-model=\"pfc.gatepass.fuel_slip_id\" ng-required=\"(pfc.gatepass.fuel_pump || pfc.gatepass.mobiloil || pfc.gatepass.fuel_quantity || pfc.gatepass.fuel_slip_id)\">\n        </div>\n        <div class=\" input_group \" id=\"popupContainer\">\n            <label for=\"expense \">Expense </label>\n            <input ng-disabled=\"true\" type=\"text\" ng-model=\"pfc.gatepass.fuel_slip_id\" ng-required=\"(pfc.gatepass.fuel_pump || pfc.gatepass.mobiloil || pfc.gatepass.fuel_quantity || pfc.gatepass.fuel_slip_id)\">\n            <!--            <p  class=\"pump_form\" ng-click=\"pfc.showAdvanced($event)\"></p>-->\n        </div>\n    </div>\n    <!-- good details  block end -->\n</div>\n<div layout=\"row \">\n    <div class=\"input_group \">\n        <label for=\"quantity \">Quantity</label>\n        <input ng-model=\"pfc.gatepass.fuel_quantity \" type=\"number \" ng-required=\"(pfc.gatepass.fuel_pump || pfc.gatepass.mobiloil || pfc.gatepass.fuel_quantity || pfc.gatepass.fuel_slip_id)\">\n    </div>\n    <div class=\"input_group \">\n        <label for=\"mobil_oil \">Mobil oil</label>\n        <input type=\"number\" ng-model=\"pfc.gatepass.mobiloil \" ng-required=\"(pfc.gatepass.fuel_pump || pfc.gatepass.mobiloil || pfc.gatepass.fuel_quantity || pfc.gatepass.fuel_slip_id)\">\n\n    </div>\n    <!-- good details  block end -->\n</div>\n"

/***/ },
/* 30 */
/***/ function(module, exports) {

	'use strict';
	
	PumpFormController.$inject = ["$scope", "$mdDialog", "$mdMedia", "DocumentService"];
	Object.defineProperty(exports, '__esModule', {
	    value: true
	});
	function PumpFormController($scope, $mdDialog, $mdMedia, DocumentService) {
	    "ngInject";
	    // for autocomplete pump
	    this.showAdvanced = function (ev) {
	        $mdDialog.show({
	            template: '<expense></expense>',
	            parent: angular.element(document.body),
	            targetEvent: ev,
	            clickOutsideToClose: true
	        });
	    };
	
	    // for autocomplete pump
	    this.searchPump = function (query) {
	        return DocumentService.search('Supplier', query, {
	            supplier_type: "Fuel Pump"
	        }).then(function (data) {
	            return data.data.results;
	        });
	    };
	}
	
	exports['default'] = PumpFormController;
	module.exports = exports['default'];

/***/ },
/* 31 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag
	
	// load the styles
	var content = __webpack_require__(32);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(7)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../../../node_modules/css-loader/index.js!./../../../../node_modules/sass-loader/index.js!./pump-form.scss", function() {
				var newContent = require("!!./../../../../node_modules/css-loader/index.js!./../../../../node_modules/sass-loader/index.js!./pump-form.scss");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 32 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(6)();
	// imports
	
	
	// module
	exports.push([module.id, "pump-form .input_group {\n  width: 50%;\n  margin-right: 5px; }\n  pump-form .input_group.full_width {\n    width: 100%; }\n    pump-form .input_group.full_width label {\n      width: 20%; }\n    pump-form .input_group.full_width input {\n      float: left;\n      width: 240px !important; }\n  pump-form .input_group input {\n    margin-bottom: 0 !important;\n    width: 55% !important;\n    padding: 0 5px; }\n  pump-form .input_group label {\n    width: 65px;\n    font-size: 13px;\n    float: left; }\n", ""]);
	
	// exports


/***/ },
/* 33 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	    value: true
	});
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	var _angular = __webpack_require__(1);
	
	var _angular2 = _interopRequireDefault(_angular);
	
	var _angularUiRouter = __webpack_require__(3);
	
	var _angularUiRouter2 = _interopRequireDefault(_angularUiRouter);
	
	var _pumpViewComponent = __webpack_require__(34);
	
	var _pumpViewComponent2 = _interopRequireDefault(_pumpViewComponent);
	
	var pumpViewModule = _angular2['default'].module('pumpViewComponent', ['ngMaterial', 'ngMessages', 'material.svgAssetsCache']).component('pumpView', _pumpViewComponent2['default']);
	
	exports['default'] = pumpViewModule;
	module.exports = exports['default'];

/***/ },
/* 34 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	    value: true
	});
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	var _pumpViewHtml = __webpack_require__(35);
	
	var _pumpViewHtml2 = _interopRequireDefault(_pumpViewHtml);
	
	var _pumpViewController = __webpack_require__(36);
	
	var _pumpViewController2 = _interopRequireDefault(_pumpViewController);
	
	__webpack_require__(37);
	
	var pumpViewComponent = {
	    restrict: 'E',
	    bindings: {
	        gatepass: '='
	    },
	    template: _pumpViewHtml2['default'],
	    controller: _pumpViewController2['default'],
	    controllerAs: 'pvc'
	};
	
	exports['default'] = pumpViewComponent;
	module.exports = exports['default'];

/***/ },
/* 35 */
/***/ function(module, exports) {

	module.exports = "<div layout=\"row\" layout-margin layout-fill class=\"md-block gd1_left listblock_dtl1\">\n    <div class=\"md-block  listblock_dtl1 pd_l35\" flex=\"100\" layout-fill=\"\">\n        <div layout=\"row\">\n            <div layout=\"row\" layout-sm=\"column\" layout-fill=\"\">\n                <div class=\"input_group label_96\">\n                    <label for=\"Pump\">Pump</label>\n                    <p class=\" full-width\">{{ pvc.gatepass.fuel_pump}} </p>\n                </div>\n            </div>\n        </div>\n        <div layout=\"row\">\n            <div class=\"input_group\">\n                <label for=\"Pump\">Fuel Id</label>\n                <p>{{ pvc.gatepass.fuel_slip_id}} </p>\n            </div>\n            <div class=\"input_group \">\n                <label for=\"expense\">Expense</label>\n                <p>{{ pvc.gatepass.expenses}}</p>\n            </div>\n            <!-- good details  block end -->\n        </div>\n        <div layout=\"row\">\n            <div class=\"input_group \">\n                <label for=\" quantity \">Quantity</label>\n                <p>{{ pvc.gatepass.fuel_quantity }}</p>\n            </div>\n            <div class=\"input_group \">\n                <label for=\"mobil_oil \">Mobil oil</label>\n                <p>{{ pvc.gatepass.mobiloil}} </p>\n            </div>\n            <!-- good details  block end {{ vm.gatepass.items.quantity}}   -->\n        </div>\n    </div>\n</div>\n<!-- good details  block end -->\n"

/***/ },
/* 36 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }
	
	var _angular = __webpack_require__(1);
	
	var _angular2 = _interopRequireDefault(_angular);
	
	var PumpViewController = function PumpViewController() {
	  _classCallCheck(this, PumpViewController);
	};
	
	exports['default'] = PumpViewController;
	module.exports = exports['default'];

/***/ },
/* 37 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag
	
	// load the styles
	var content = __webpack_require__(38);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(7)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../../../node_modules/css-loader/index.js!./../../../../node_modules/sass-loader/index.js!./pump-view.scss", function() {
				var newContent = require("!!./../../../../node_modules/css-loader/index.js!./../../../../node_modules/sass-loader/index.js!./pump-view.scss");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 38 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(6)();
	// imports
	
	
	// module
	exports.push([module.id, "pump-view {\n  width: 100%; }\n  pump-view .gd1_left .input_group {\n    float: left;\n    width: 50%; }\n    pump-view .gd1_left .input_group.label_96 {\n      width: 100%; }\n    pump-view .gd1_left .input_group label {\n      float: left;\n      width: 60px; }\n", ""]);
	
	// exports


/***/ },
/* 39 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	    value: true
	});
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	var _angular = __webpack_require__(1);
	
	var _angular2 = _interopRequireDefault(_angular);
	
	var _angularUiRouter = __webpack_require__(3);
	
	var _angularUiRouter2 = _interopRequireDefault(_angularUiRouter);
	
	var _loginComponent = __webpack_require__(40);
	
	var _loginComponent2 = _interopRequireDefault(_loginComponent);
	
	var _settingsJs = __webpack_require__(45);
	
	var _settingsJs2 = _interopRequireDefault(_settingsJs);
	
	var _userJs = __webpack_require__(46);
	
	var _userJs2 = _interopRequireDefault(_userJs);
	
	var loginModule = _angular2['default'].module('login', ['ngMaterial', 'ngMessages', 'material.svgAssetsCache']).component('login', _loginComponent2['default']).factory('SettingsFactory', _settingsJs2['default']).factory('UserService', _userJs2['default']);
	
	exports['default'] = loginModule;
	module.exports = exports['default'];

/***/ },
/* 40 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	    value: true
	});
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	var _loginHtml = __webpack_require__(41);
	
	var _loginHtml2 = _interopRequireDefault(_loginHtml);
	
	var _loginControllerJs = __webpack_require__(42);
	
	var _loginControllerJs2 = _interopRequireDefault(_loginControllerJs);
	
	__webpack_require__(43);
	
	var loginComponent = {
	    restrict: 'E',
	    bindings: {
	        onCreation: '&'
	    },
	    template: _loginHtml2['default'],
	    controller: _loginControllerJs2['default'],
	    controllerAs: 'lc'
	};
	
	exports['default'] = loginComponent;
	module.exports = exports['default'];

/***/ },
/* 41 */
/***/ function(module, exports) {

	module.exports = "<!-- USING ROW FOR DESKTOP AND COLUMN FOR MOBILE DEVICES -->\r\n\r\n<md-content>\r\n    <div class=\"login\">\r\n        <div class=\"login_container\">\r\n            <div class=\"login_header\">\r\n                <ul>\r\n                    <li><i class=\"ion-ios-speedometer-outline\"></i><span>Trip Management</span></li>\r\n                </ul>\r\n            </div>\r\n            <div layout=\"column\" layout-fill=\"\">\r\n                <div class=\"logo\">\r\n                    <img src=\"assets/images/logo.png\" alt=\"Logo\">\r\n                </div>\r\n                <div layout=\"row\" layout-align=\"center center\" class=\"ng-scope\">\r\n                    <md-card class=\"md-default-theme wrapper\">\r\n                        <md-card-content class=\"pd0\">\r\n                            <md-list role=\"list\" class=\"pd0\">\r\n                                <!-- vocher1 start here -->\r\n\r\n                                <div class=\"md-toolbar-tools main_heading\">\r\n                                    <h1>LOGIN</h1>\r\n                                </div>\r\n\r\n                                <!-- new Voucher list start here -->\r\n                                <md-item>\r\n\r\n                                    <form>\r\n                                        <div class=\"input-group\">\r\n                                            <label class=\"item item-input\"><span class=\"input-label\">Email ID</span></label>\r\n                                            <input type=\"text\" ng-model=\"loginData.username\">\r\n                                        </div>\r\n                                        <div class=\"input-group password\">\r\n                                            <label class=\"item item-input\">\r\n                                                <span class=\"input-label\" ng-init=\"passwordInputType = 'password'\">Password</span></label>\r\n                                            <input type=\"{{passwordInputType}}\" ng-model=\"loginData.password\">\r\n                                            <a class=\"button button-clear\" style=\"padding-right: 15%\" ng-click=\"passwordInputType = { 'password': 'text', 'text': 'password'}[passwordInputType];\">\r\n                                                <i ng-class=\"passwordInputType=='password'?'ion-eye-disabled':'ion-eye'\"></i>\r\n                                            </a>\r\n                                        </div>\r\n                                        <div class=\"item login_btn\">\r\n                                            <button class=\"button button-block button-dark\" ng-click=\"lc.login()\">Log In</button>\r\n                                        </div>\r\n                                    </form>\r\n                                </md-item>\r\n                                <!-- new voucher list end here -->\r\n\r\n                            </md-list>\r\n                        </md-card-content>\r\n                    </md-card>\r\n                </div>\r\n            </div>\r\n        </div>\r\n    </div>\r\n</md-content>\r\n"

/***/ },
/* 42 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	    value: true
	});
	
	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }
	
	var _angular = __webpack_require__(1);
	
	var _angular2 = _interopRequireDefault(_angular);
	
	/* @ngInject */
	
	var LoginController = (function () {
	    LoginController.$inject = ["$state", "UserService", "SettingsFactory", "$scope", "$rootScope"];
	    function LoginController($state, UserService, SettingsFactory, $scope, $rootScope) {
	        _classCallCheck(this, LoginController);
	
	        this.$state = $state;
	        this.UserService = UserService;
	        this.SettingsFactory = SettingsFactory;
	        this.$scope = $scope;
	        this.$rootScope = $rootScope;
	
	        console.log("Hi from Login Function");
	
	        $scope.loginData = {
	            username: '',
	            password: ''
	        };
	    }
	
	    _createClass(LoginController, [{
	        key: 'login',
	        value: function login() {
	            var _this = this;
	
	            this.UserService.login(this.$scope.loginData.username, this.$scope.loginData.password).then(function (response) {
	                var settings = _this.SettingsFactory.get();
	                settings.full_name = response.data.full_name;
	                settings.sid = response.data.sid;
	                _this.SettingsFactory.set(settings);
	                _this.$rootScope.$emit('login:success');
	            }, function (error) {
	                console.log(error);
	            });
	        }
	    }]);
	
	    return LoginController;
	})();
	
	exports['default'] = LoginController;
	module.exports = exports['default'];

/***/ },
/* 43 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag
	
	// load the styles
	var content = __webpack_require__(44);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(7)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../../../node_modules/css-loader/index.js!./../../../../node_modules/sass-loader/index.js!./login.scss", function() {
				var newContent = require("!!./../../../../node_modules/css-loader/index.js!./../../../../node_modules/sass-loader/index.js!./login.scss");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 44 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(6)();
	// imports
	
	
	// module
	exports.push([module.id, ".login .main_heading h1 {\n  text-align: center;\n  display: block;\n  width: 100%; }\n\n.login md-item {\n  padding: 30px 0; }\n  .login md-item form {\n    max-width: 80%;\n    margin: 0 auto; }\n    .login md-item form input {\n      width: 100%;\n      height: 35px;\n      margin-bottom: 10px;\n      padding: 0 10px;\n      font-size: 14px; }\n    .login md-item form .password {\n      position: relative; }\n      .login md-item form .password a {\n        position: absolute;\n        top: 30px;\n        right: -45px; }\n    .login md-item form .login_btn {\n      margin-top: 20px; }\n      .login md-item form .login_btn button {\n        background: #424242;\n        border: none;\n        color: #fff;\n        width: 100px;\n        padding: 10px;\n        display: block;\n        margin: 0 auto;\n        text-transform: uppercase;\n        font-size: 15px;\n        border-radius: 5px; }\n        .login md-item form .login_btn button:hover {\n          background: red; }\n\n.login .wrapper {\n  width: 30%; }\n\n.login .login_header {\n  width: 100%;\n  background: #424242;\n  padding: 4px 0 1px 0px;\n  margin: 0px 0 70px 0; }\n  .login .login_header ul {\n    margin: 0;\n    padding: 0 0 10px 0; }\n    .login .login_header ul li {\n      list-style: none;\n      color: #fff;\n      font-size: 20px;\n      text-align: center;\n      text-transform: uppercase;\n      font-weight: 500; }\n      .login .login_header ul li i {\n        margin-right: 10px;\n        font-size: 35px;\n        position: relative;\n        line-height: 0;\n        top: 5px; }\n", ""]);
	
	// exports


/***/ },
/* 45 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	    value: true
	});
	function settingsFactory() {
	    var _settingsKey = "appSettings",
	        defaultSettings = {
	        serverBaseUrl: '/api',
	        reviewServerBaseUrl: '/review',
	        language: 'en'
	    };
	
	    return {
	        get: _retrieveSettings,
	        set: _saveSettings,
	        getERPServerBaseUrl: function getERPServerBaseUrl() {
	            return 'https://erp.arungas.com';
	            //            return 'http://192.168.31.195:8080';
	        },
	        getSid: function getSid() {
	            return _retrieveSettings().sid;
	        },
	        getReviewServerBaseUrl: function getReviewServerBaseUrl() {
	            //            return 'http://192.168.31.195:8080';
	        }
	    };
	
	    function _retrieveSettings() {
	        var settings = localStorage[_settingsKey];
	        if (settings) return angular.fromJson(settings);
	        return defaultSettings;
	    }
	
	    function _saveSettings(settings) {
	        localStorage[_settingsKey] = angular.toJson(settings);
	    }
	}
	
	exports['default'] = settingsFactory;
	module.exports = exports['default'];

/***/ },
/* 46 */
/***/ function(module, exports) {

	'use strict';
	
	userService.$inject = ["$http", "SettingsFactory", "$rootScope", "$q"];
	Object.defineProperty(exports, '__esModule', {
	    value: true
	});
	function userService($http, SettingsFactory, $rootScope, $q) {
	    "ngInject";
	    $rootScope.userLoaded = false;
	
	    var factory = {
	        login: function login(usr, pwd) {
	            var data = {
	                usr: usr,
	                pwd: pwd
	            };
	            var url = SettingsFactory.getERPServerBaseUrl() + '/api/method/login?' + $.param(data);
	            return $http({
	                url: url,
	                method: 'POST',
	                loading: true
	            });
	        },
	
	        // function used by loadUser function
	        get_startup_data: function get_startup_data() {
	            var data = {
	                cmd: 'startup',
	                _type: 'POST'
	            };
	            return $http({
	                url: SettingsFactory.getERPServerBaseUrl(),
	                data: $.param(data),
	                method: 'POST'
	            });
	        },
	
	        loadUser: function loadUser(force) {
	            var defferd = $q.defer();
	            if (!$rootScope.userLoaded) {
	                this.get_startup_data().then(function (data) {
	                    $rootScope.startup = {
	                        user: data.data.user_info[data.data.user.name],
	                        can_write: data.data.user.can_write,
	                        server_time: data.data.server_date
	                    };
	                    defferd.resolve();
	                    $rootScope.userLoaded = true;
	                })['catch'](function () {
	                    defferd.reject();
	                    $rootScope.$broadcast('user:logout');
	                });
	            } else defferd.resolve();
	
	            return defferd.promise;
	        }
	
	    };
	
	    return factory;
	};
	
	exports['default'] = userService;
	module.exports = exports['default'];

/***/ },
/* 47 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag
	
	// load the styles
	var content = __webpack_require__(48);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(7)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../node_modules/css-loader/index.js!./../../node_modules/sass-loader/index.js!./style.scss", function() {
				var newContent = require("!!./../../node_modules/css-loader/index.js!./../../node_modules/sass-loader/index.js!./style.scss");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 48 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(6)();
	// imports
	exports.push([module.id, "@import url(https://fonts.googleapis.com/css?family=Open+Sans:400,300,600,700,800);", ""]);
	
	// module
	exports.push([module.id, "body {\n  font-family: open sans; }\n\n.pd0 {\n  padding: 0 !important; }\n\n.card_wrap {\n  padding: 0;\n  margin: 15px 15px 30px 15px;\n  border: 1px solid #e1e1e1; }\n\nh4 {\n  color: #424242;\n  font-size: 16px;\n  font-weight: 400; }\n\n.pd_t40 {\n  padding-top: 40px; }\n\n.border-left {\n  border-left: 1px solid #ccc; }\n\n.pd_l40 {\n  padding-left: 40px !important; }\n\n*:focus {\n  outline: none; }\n\np {\n  margin-top: 9px; }\n\n/*================= Extsassssend style start =============== */\n.red_text {\n  color: #ff0000; }\n\n.black, div[layout=\"column\"] md-toolbar {\n  background: #424242 !important; }\n\n.red {\n  background: #ff0000 !important; }\n\n.l-grey {\n  background: #f3f3f3 !important; }\n\n.primary_p, .toolbar_right p {\n  color: #333;\n  font-size: 15px;\n  display: inline-block;\n  padding: 0;\n  margin: 0; }\n\n.heading_h3 {\n  font-size: 23px;\n  font-weight: 300; }\n\n/*================= Extend  style end =============== */\n/*================= variables style start =============== */\n.wrap_contain {\n  padding: 20px 10px; }\n\nnew-voucher form {\n  position: relative; }\n\n.wrapper {\n  max-width: 1200px !important;\n  padding-top: 10px; }\n\nmd-card {\n  margin: 0px 0 0 0;\n  box-shadow: none; }\n  md-card i {\n    font-size: 18px;\n    color: #7d7d7d; }\n  md-card .layout-row {\n    padding: 0 !important; }\n  md-card section {\n    width: 100% !important;\n    float: left !important; }\n  md-card .main_wrapper {\n    margin-top: 20px;\n    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.2), 0 1px 1px 0 rgba(0, 0, 0, 0.14), 0 2px 1px -1px rgba(0, 0, 0, 0.12); }\n  md-card .clearfix {\n    clear: both; }\n  md-card .layout-wrap input {\n    border: 1px solid #e1e1e1;\n    padding: 5px 10px; }\n  md-card .layout-wrap p {\n    margin-top: 9px !important; }\n  md-card label {\n    font-size: 14px;\n    color: #666666 !important;\n    width: 120px;\n    margin-bottom: 5px;\n    display: inline-block; }\n    md-card label i {\n      margin-right: 10px;\n      font-size: 22px; }\n  md-card .input_group {\n    margin-bottom: 10px; }\n  md-card .submit_button {\n    border-bottom: 1px solid #ccc;\n    padding: 3px 10px; }\n    md-card .submit_button p {\n      padding-top: 10px;\n      margin: 0;\n      float: left; }\n    md-card .submit_button button {\n      color: #fff !important;\n      float: right;\n      min-height: 32px;\n      height: 32px;\n      line-height: 20px; }\n  md-card .main_heading {\n    background-color: #ff0000;\n    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.2), 0 1px 1px 0 rgba(0, 0, 0, 0.14), 0 2px 1px -1px rgba(0, 0, 0, 0.12); }\n    md-card .main_heading h1 {\n      font-size: 20px;\n      margin: 0;\n      color: #fff;\n      padding: 20px; }\n\n.user_block {\n  position: absolute;\n  right: 2%;\n  top: 15px; }\n  .user_block p {\n    font-size: 15px;\n    color: #fff;\n    margin: 5px 0 0 10px;\n    float: left; }\n  .user_block span {\n    font-size: 13px;\n    color: #fff;\n    margin: 0px 0 0 15px;\n    float: right;\n    background: red;\n    padding: 8px 15px;\n    text-transform: uppercase;\n    border-radius: 3px; }\n\n/*============== header block =============== */\ndiv[layout=\"column\"] md-toolbar {\n  position: relative; }\n  div[layout=\"column\"] md-toolbar .toolbar_left {\n    position: relative;\n    top: 0px; }\n  div[layout=\"column\"] md-toolbar md-datepicker {\n    background: none; }\n    div[layout=\"column\"] md-toolbar md-datepicker .md-datepicker-input-container {\n      border: none !important; }\n      div[layout=\"column\"] md-toolbar md-datepicker .md-datepicker-input-container .md-datepicker-input {\n        border: none;\n        color: #fff;\n        background: none;\n        min-width: 95px !important;\n        height: 31px; }\n\n.warehouse {\n  float: left;\n  display: inline-block; }\n  .warehouse p {\n    float: left;\n    margin: 5px 0 0 10px;\n    font-size: 18px; }\n    .warehouse p i {\n      margin-right: 10px;\n      font-size: 20px; }\n  .warehouse md-autocomplete {\n    float: left;\n    margin-left: 15px;\n    background: none;\n    border: 1px solid #ccc;\n    width: 280px; }\n\n.md-toolbar-tools h3 {\n  margin: 12px 5px 0 0px;\n  border-right: 2px solid #fff;\n  float: left;\n  padding-right: 10px;\n  line-height: 16px;\n  font-weight: 300; }\n\n.md-toolbar-tools .date_picker {\n  width: 160px;\n  float: left;\n  margin-left: 10px;\n  margin-top: 2px; }\n  .md-toolbar-tools .date_picker span {\n    font-size: 15px; }\n\n.md-datepicker-calendar-icon,\n.md-datepicker-button {\n  display: none; }\n\n.md-datepicker-calendar-pane {\n  border: none;\n  top: 24px !important;\n  left: 120px !important;\n  box-shadow: none; }\n  .md-datepicker-calendar-pane .md-datepicker-input-mask-opaque {\n    background: none; }\n  .md-datepicker-calendar-pane .md-calendar-month-label {\n    color: #fff !important; }\n  .md-datepicker-calendar-pane .md-datepicker-calendar {\n    background: #424242; }\n  .md-datepicker-calendar-pane .md-pane-open .md-datepicker-calendar {\n    background: #424242; }\n  .md-datepicker-calendar-pane .md-calendar-date-today .md-calendar-date-selection-indicator {\n    color: #424242; }\n  .md-datepicker-calendar-pane .md-datepicker-input-container {\n    border: 0; }\n  .md-datepicker-calendar-pane .md-datepicker-button {\n    display: none; }\n  .md-datepicker-calendar-pane .md-datepicker-input {\n    min-width: 95px; }\n\n.md-button.md-icon-button {\n  height: 10px !important;\n  width: 10px !important; }\n\n.md-datepicker-triangle-button {\n  top: 25% !important;\n  opacity: 0;\n  left: -50px;\n  min-width: 95px !important; }\n  .md-datepicker-triangle-button .md-datepicker-expand-triangle {\n    border-top-color: #fff !important; }\n\n.md-calendar-scroll-container {\n  background: #424242;\n  border: none;\n  padding-left: 0;\n  margin-left: 0; }\n\n.md-calendar-date-selection-indicator {\n  color: #fff !important; }\n\n.gd1_left {\n  border-right: 1px solid #ccc;\n  margin-right: 15px; }\n\n.md-block h4 {\n  margin: 5px 0 10px 0; }\n\n.input_block .input_group:first-child {\n  margin-right: 20px; }\n\n.input_block .input_group p {\n  display: inline-block;\n  font-size: 14px;\n  color: #a6a5a5;\n  margin-top: 5px !important; }\n\n.gd1_right {\n  box-sizing: border-box; }\n\n.input_50 {\n  background: #f5f5f5;\n  padding: 15px 20px; }\n  .input_50 input {\n    width: 75px; }\n\nmd-item {\n  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.2), 0 1px 1px 0 rgba(0, 0, 0, 0.14), 0 2px 1px -1px rgba(0, 0, 0, 0.12);\n  display: block;\n  margin-bottom: 20px; }\n\n.input_group input {\n  border: 1px solid #e1e1e1;\n  padding: 0px 0px 0 10px;\n  height: 30px;\n  font-size: 13px;\n  margin-top: 0 !important; }\n\n.input_group p {\n  display: inline-block;\n  font-size: 14px;\n  color: #a6a5a5;\n  margin-bottom: 5px; }\n\n.list_block ul {\n  padding: 0; }\n  .list_block ul li {\n    list-style: none;\n    font-size: 14px;\n    margin-bottom: 10px;\n    color: #666666; }\n\n.listblock_dtl {\n  margin-top: 20px; }\n  .listblock_dtl .listblock_dtl1 {\n    border: 0; }\n  .listblock_dtl .input_group {\n    margin-bottom: 0; }\n  .listblock_dtl .pd_l40 {\n    padding-left: 40px !important; }\n\n.notifications_block {\n  padding: 0 10px 10px 10px;\n  margin: 15px 15px 20px 15px;\n  width: 100%; }\n  .notifications_block h1 {\n    font-size: 22px;\n    color: #424242;\n    font-weight: 500;\n    margin: 0 0 20px 0; }\n  .notifications_block ul {\n    padding: 0;\n    width: 100%; }\n    .notifications_block ul li {\n      list-style: none;\n      display: inline-block;\n      background: #f3f3f3;\n      padding: 7px;\n      width: 96%;\n      border-bottom: 1px solid #ccc;\n      margin-bottom: 1px;\n      border-radius: 3px; }\n      .notifications_block ul li i {\n        font-size: 18px;\n        margin: 0 15px; }\n      .notifications_block ul li a {\n        color: #666;\n        font-size: 13px;\n        font-weight: 400;\n        text-decoration: none;\n        padding: 2px 0px;\n        background: #f3f3f3;\n        width: 46%;\n        display: inline-block; }\n        .notifications_block ul li a.tripid {\n          font-weight: bold;\n          font-size: 14px; }\n          .notifications_block ul li a.tripid i {\n            color: #666; }\n        .notifications_block ul li a i {\n          margin: 0 10px 0 5px;\n          color: #888; }\n      .notifications_block ul li span {\n        display: block;\n        width: 100%; }\n\n.detail_block2 .gd1_left .input_group {\n  width: 100%; }\n  .detail_block2 .gd1_left .input_group label {\n    width: 65px;\n    font-size: 13px; }\n  .detail_block2 .gd1_left .input_group input {\n    width: 78%; }\n\nui-view {\n  display: block;\n  width: 100%; }\n\n.viwe_more_card {\n  margin: 15px; }\n\n.view_more {\n  background: #424242;\n  padding: 10px;\n  color: #fff;\n  position: relative; }\n  .view_more p {\n    margin: 0;\n    padding: 0px 20px 0px 15px;\n    position: absolute;\n    width: 97%;\n    height: 52px;\n    left: 0;\n    top: 0;\n    line-height: 52px; }\n  .view_more i {\n    float: right;\n    font-size: 24px;\n    color: #fff; }\n\n.new_vocher_block .gd1_left {\n  width: 420px;\n  padding-right: 15px; }\n\n.mat_list p {\n  margin-right: 10px; }\n\nopen-gatepass .gd1_left {\n  max-width: 436px !important;\n  padding-left: 34px; }\n\nopen-gatepass .more_block {\n  position: relative; }\n  open-gatepass .more_block p {\n    max-width: 70px !important;\n    display: inline-block;\n    width: 250px; }\n\nopen-gatepass .layout-fill {\n  height: auto;\n  min-height: auto; }\n\nopen-gatepass .input_group .full-width {\n  width: 150px !important;\n  max-width: 150px !important; }\n\nopen-gatepass .label_96 label {\n  width: 96px !important; }\n\nopen-gatepass .pd_l20 {\n  padding-left: 20px !important; }\n\n.View_More {\n  content: \"View More\"; }\n\n.bold {\n  font-weight: bold !important; }\n\ninput[type=number] {\n  -moz-appearance: textfield; }\n\ninput[type=number]::-webkit-outer-spin-button {\n  -webkit-appearance: none;\n  -moz-appearance: none;\n  appearance: none;\n  margin: 0; }\n\n.col-3 {\n  width: 33.3%;\n  float: left; }\n\n.collaps.item_detail {\n  height: 225px !important; }\n\n.ng-isolate-scope {\n  padding: 0; }\n\ninput[type=\"date\"]::-webkit-calendar-picker-indicator,\ninput[type=\"date\"]::-webkit-inner-spin-button {\n  display: none; }\n\nbutton.refresh_icon {\n  padding: 0px 10px 0 0;\n  color: #333;\n  display: inline-block !important;\n  float: left !important;\n  border: none;\n  background: none;\n  margin-top: 5px; }\n\nbutton i {\n  font-size: 25px; }\n\n.md-toolbar-tools {\n  width: 100%; }\n  .md-toolbar-tools .toolbar_left {\n    float: left;\n    width: 75%; }\n  .md-toolbar-tools .toolbar_right {\n    float: right;\n    width: 300px; }\n    .md-toolbar-tools .toolbar_right .user_block {\n      float: right; }\n\n.close_gatepass {\n  margin: 15px !important;\n  display: block;\n  border: 1px solid #ccc; }\n  .close_gatepass .refresh_icon {\n    display: none !important; }\n\n.empty_block {\n  padding: 20px 0 20px 0;\n  text-align: center; }\n  .empty_block i {\n    display: block;\n    font-size: 50px;\n    padding: 4px 0 10px 0;\n    color: lightgreen; }\n\n.pump_form {\n  border: 1px solid #e1e1e1;\n  padding: 0 0 0 10px;\n  height: 30px;\n  font-size: 13px !important;\n  margin-top: 0 !important;\n  background: none;\n  width: 55%; }\n\n.error_popup {\n  border: 1px solid #ccc;\n  background: #fff;\n  font-size: 15px;\n  height: 100px;\n  width: 100px;\n  position: absolute;\n  top: 3%;\n  margin: 0 auto;\n  left: 0;\n  right: 0;\n  z-index: 9999; }\n\ninput:-webkit-autofill,\ntextarea:-webkit-autofill,\nselect:-webkit-autofill {\n  background-color: #fff !important;\n  border: 1px solid #ccc; }\n\n.logo {\n  display: block;\n  margin: 0 auto 20px; }\n  .logo img {\n    width: 200px;\n    margin: 0 auto; }\n\n.login {\n  background: url(" + __webpack_require__(49) + ");\n  height: 100%;\n  background-position: top center;\n  background-repeat: repeat;\n  background-attachment: fixed;\n  top: 0px;\n  left: 0px;\n  width: 100%;\n  position: fixed; }\n  .login .login_container {\n    height: 1000px;\n    overflow-y: scroll; }\n\nmd-card.md-default-theme,\nmd-card {\n  background: none; }\n  md-card.md-default-theme md-item,\n  md-card md-item {\n    background: #fff; }\n\n#popuperror md-dialog {\n  max-width: 30%; }\n  #popuperror md-dialog .md-dialog-content {\n    padding: 0px !important; }\n    #popuperror md-dialog .md-dialog-content h2 {\n      color: red;\n      font-size: 18px !important; }\n    #popuperror md-dialog .md-dialog-content p {\n      font-size: 14px !important; }\n\nmd-dialog-actions button {\n  background: #424242 !important;\n  padding: 10px 20px; }\n  md-dialog-actions button span {\n    color: #fff;\n    font-weight: bold;\n    font-size: 14px; }\n", ""]);
	
	// exports


/***/ },
/* 49 */
/***/ function(module, exports) {

	module.exports = "data:image/jpeg;base64,/9j/4QAYRXhpZgAASUkqAAgAAAAAAAAAAAAAAP/sABFEdWNreQABAAQAAABjAAD/7gAOQWRvYmUAZMAAAAAB/9sAhAABAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQECAQEBAgICAgICAwMDAwMDAwMDAwMDAwMDAQEBAQEBAQIBAQIDAgICAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwP/wAARCAAcABwDAREAAhEBAxEB/8QAcgAAAwADAAAAAAAAAAAAAAAAAwQFAAIKAQEBAQAAAAAAAAAAAAAAAAAAAQIQAAECBAQDBAsAAAAAAAAAAAERAgAhQQMxYRITUXEEkSIyQqGxwVJiIzNDFCSEEQEBAAMBAAAAAAAAAAAAAAAAARExYZH/2gAMAwEAAhEDEQA/AO9Lprmki1edLC1ediw+7d5nCMYFHYyINQQrl+LmIAF/TZaFaHOdJltELiKuybFEtbu5varm4qr9pcEXhSIHjZpM8U4dkUGb1Q6drWXkJcUskiYlIOogMOAb2Pe5znqXEzRNPEaVokRWuzke0RA5eLLTFIVzpMt1cRV2MhGrtEl1s3C57yXvd4j5QBRuQgHOmu6UtXT3cLd1O6w0ZemJE+HNYsFHZHA8p8uysUIXNWo731vPpXbx8i09qxKB92qZYYRPRny0dhqQJwRZ5KmEWBr93TT8NP6dv1Kvoij/2Q=="

/***/ },
/* 50 */
/***/ function(module, exports) {

	module.exports = "<div layout=\"column\" class=\"relative\" layout-fill role=\"main\">\n    <md-toolbar>\n        <div class=\"md-toolbar-tools\">\n            <div class=\"toolbar_left\">\n                <h3> ERP </h3>\n                <div class=\"date_picker\"> <span>Date</span>\n                    <md-datepicker ng-model=\"mc.workingDate\" md-placeholder=\"Enter date\" ng-change=\"mc.onDateChange()\"> </md-datepicker>\n                </div>\n                <div class=\"warehouse\">\n                    <p><i class=\"ion-ios-home-outline\" aria-hidden=\"true\"></i>warehouse</p>\n                    <md-autocomplete md-selected-item=\"mc.warehouse\" md-item-text=\"item.value\" md-items=\"item in mc.searchWarehouse(ctrl.txtWarehouse)\" md-search-text=\"ctrl.txtWarehouse\" md-min-length=\"0\" placeholder=\"Select Warehouse\" md-no-cache=\"noCacheResults\" ng-required=\"!mc.warehouse\">\n                        <md-item-templat> <span md-highlight-text=\"ctrl.txtWarehouse\" md-highlight-flags=\"^i\">{{item.value}}</span> </md-item-templat>\n                        <md-not-found>\n                            No warehouse matching \"{{ctrl.txtWarehouse}}\" were found.\n                        </md-not-found>\n                    </md-autocomplete>\n                </div>\n            </div>\n            <div class=\"toolbar_right\">\n                <div class=\"user_block\">\n                    <p>\n                        <!--   <img src=\"img/user\" alt=\"user\" />-->{{mc.settings.full_name}}</p>\n                    <span ng-click=\"mc.logout()\">Logout</span>\n                </div>\n            </div>\n        </div>\n    </md-toolbar>\n\n\n    <md-content ng-if=\"mc.warehouse && mc.warehouse.value != ''\">\n        <!-- <md-content ng-if=\"mc.warehouse && mc.warehouse.value != ''\">-->\n        <div id=\"popuperror\">\n            <div class=\"dialog-demo-content\" layout=\"row\" ayout=\"row\" layout-wrap layout-margin layout-align=\"center\">\n\n\n            </div>\n        </div>\n        <div layout=\"column\" layout-fill=\"\">\n            <div layout=\"row\" layout-align=\"center center\" class=\"ng-scope\">\n                <md-card flex-gt-sm=\"65\" flex-gt-md=\"90\" class=\"md-default-theme wrapper\">\n                    <md-card-content class=\"pd0\">\n                        <md-list role=\"list\" class=\"pd0\">\n                            <!-- vocher1 start here -->\n                            <div class=\"md-toolbar-tools main_heading\">\n                                <h1>New Voucher</h1> </div>\n                            <!-- new Voucher list start here -->\n                            <md-item>\n                                <div layout=\"row\">\n                                    <div flex-gt-sm=\"68\" flex-gt-md=\"70\" class=\"ptn-info-grid\">\n                                        <div class=\"card_wrap\">\n                                            <new-voucher ng-attr-on-creation=\"mc.addOpenGatepass(gatepass)\"></new-voucher>\n                                        </div>\n                                    </div>\n                                    <!-- notifications block start here -->\n                                    <div layout=\"row\" flex-gt-sm=\"30\" flex-gt-md=\"30\" id=\"customer-phone-img\" layout-fill=\"\">\n                                        <div class=\"notifications_block\">\n                                            <h1>Notifications</h1>\n                                            <ul>\n                                                <li ng-repeat=\"notification in mc.notificationsList\">\n                                                    <span> <a class=\"tripid\" href=\"#\"><i class=\"ion-android-train\"></i>{{notification.name}}</a> <a href=\"#\"><i class=\"ion-android-bus \"></i>{{notification.vehicle}}</a></span>\n                                                    <span><a href=\"#\"><i class=\"ion-arrow-up-a\"></i>{{notification.out_gatepass}}</a><a href=\"#\"><i class=\"ion-android-calendar\"></i>{{notification.date}}</a></span>\n                                                </li>\n                                            </ul>\n                                        </div>\n                                    </div>\n                                    <!-- notifications block end here -->\n                                </div>\n                            </md-item>\n                            <!-- new voucher list end here -->\n                            <!-- vocher1 start here  -->\n                            <!-- open gatepass start here -->\n                            <md-item class=\"opengatepass list_contain\" init=\"mc.coll\">\n                                <div class=\"md-toolbar-tools main_heading\">\n                                    <h1>Open Gatepass</h1> </div>\n                                <div layout=\"row\">\n                                    <div flex=\"100\" class=\"ptn-info-grid\">\n                                        <div class=\"card_wrap\" ng-repeat=\"gatepass in mc.openGatepassList track by $index\">\n                                            <open-gatepass gatepass=\"gatepass\" disabled=\"false\" on-refresh=\"mc.onRefresh(tripid)\" on-submit=\"mc.addClosedGatepass(gatepass);\"></open-gatepass>\n                                        </div>\n                                        <div ng-hide=\"mc.openGatepassList.length\" class=\"empty_block\"><i class=\"ion-ios-checkmark\"></i>Good work , Not any Open Gatepass !</div>\n                                    </div>\n                                </div>\n                            </md-item>\n                            <!-- vocher1 start here  -->\n                            <!-- good wills block item start -->\n                            <!-- open gatepass start here -->\n                            <md-item class=\"opengatepass list_contain close_gatepss\">\n                                <div class=\"md-toolbar-tools main_heading\">\n                                    <h1>Close</h1>\n                                </div>\n                                <div layout=\"row\">\n                                    <div flex=\"100\" class=\"ptn-info-grid\">\n                                        <div class=\"close_gatepass\" ng-repeat=\"gatepass in mc.closedGatepassList track by $index\">\n                                            <open-gatepass gatepass=\"gatepass\" disabled=\"true\" on-refresh=\"mc.onRefresh(tripid)\"></open-gatepass>\n                                        </div>\n                                        <div ng-hide=\"mc.closedGatepassList.length\" class=\"empty_block\">Not any Closed Gatepass</div>\n                                    </div>\n                                </div>\n                            </md-item>\n                            <!-- vocher1 start here  -->\n                            <!-- good wills block item end -->\n                        </md-list>\n                    </md-card-content>\n                </md-card>\n            </div>\n        </div>\n        <div class=\"reqired_fields \">\n            <p ng-show=\"warehouse.$error.required \"> warehouse This is required!</p>\n        </div>\n    </md-content>\n</div>\n"

/***/ }
]);
//# sourceMappingURL=app.bundle.js.map
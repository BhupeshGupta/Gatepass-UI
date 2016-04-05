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
        // @see: https://github.com/angular-ui/ui-router/wiki/Frequently-Asked-Questions
        // #how-to-configure-your-server-to-work-with-html5mode
        //        $locationProvider.html5Mode(true).hashPrefix('!');
    })

.config(stateConfig);

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


function AppController() {
    var vm = this;
    this.v = [{
            "creation": "2016-03-22 20:13:39.181818",
            "voucher_type": "ERV",
            "doctype": "Gatepass",
            "fuel_quantity": 150,
            "owner": "ameer1982ahmad@gmail.com",
            "posting_time": "20:11:36",
            "modified_by": "ameer1982ahmad@gmail.com",
            "transaction_date": "2016-03-22",
            "vehicle": "PB13AL5026",
            "warehouse": "Sherpur Godwon - AL",
            "docstatus": 1,
            "fuel_slip_id": "1168",
            "company": "Arun Logistics",
            "driver": "SURJIT SINGH",
            "fiscal_year": "2015-16",
            "fuel_pump": "Modern Motors Works",
            "dispatch_destination": "Plant",
            "name": "P-GP/2075-Out",
            "expenses": 677,
            "mobiloil": 20,
            "items": [
                {
                    "modified_by": "ameer1982ahmad@gmail.com",
                    "name": "720c5673910772009fccf7762bf22973e08b601f2a0ba8b513d4ec2f",
                    "parent": "P-GP/2075-Out",
                    "item": "EC19",
                    "creation": "2016-03-22 20:13:39.181818",
                    "modified": "2016-03-22 20:13:42.954506",
                    "doctype": "Gatepass Item",
                    "idx": 1,
                    "parenttype": "Gatepass",
                    "owner": "ameer1982ahmad@gmail.com",
                    "docstatus": 1,
                    "quantity": 80,
                    "parentfield": "items"
    }



                , {
                    "modified_by": "ameer1982ahmad@gmail.com",
                    "name": "abeccd721da274946658f2e01c7c4d3994d82cda25558692aceeaa40",
                    "parent": "P-GP/2075-Out",
                    "item": "EC47.5",
                    "creation": "2016-03-22 20:13:39.181818",
                    "modified": "2016-03-22 20:13:42.954506",
                    "doctype": "Gatepass Item",
                    "idx": 2,
                    "parenttype": "Gatepass",
                    "owner": "ameer1982ahmad@gmail.com",
                    "docstatus": 1,
                    "quantity": 75,
                    "parentfield": "items"
    }
  ],
            "route": "LUDHIANA TO BAHADURGARH",
            "modified": "2016-03-22 20:13:42.954506",
            "gatepass_type": "Out",
            "posting_date": "2016-03-22"
        },
        {
            "creation": "2016-03-22 20:13:39.181818",
            "voucher_type": "ERV",
            "doctype": "Gatepass",
            "fuel_quantity": 150,
            "owner": "ameer1982ahmad@gmail.com",
            "posting_time": "20:11:36",
            "modified_by": "ameer1982ahmad@gmail.com",
            "transaction_date": "2016-03-22",
            "vehicle": "PB13AL5026",
            "warehouse": "Sherpur Godwon - AL",
            "docstatus": 1,
            "fuel_slip_id": "1168",
            "company": "Arun Logistics",
            "driver": "SURJIT SINGH",
            "fiscal_year": "2015-16",
            "fuel_pump": "Modern Motors Works",
            "dispatch_destination": "Plant",
            "name": "P-GP/2075-Out",
            "expenses": 677,
            "mobiloil": 20,
            "items": [
                {
                    "modified_by": "ameer1982ahmad@gmail.com",
                    "name": "720c5673910772009fccf7762bf22973e08b601f2a0ba8b513d4ec2f",
                    "parent": "P-GP/2075-Out",
                    "item": "EC19",
                    "creation": "2016-03-22 20:13:39.181818",
                    "modified": "2016-03-22 20:13:42.954506",
                    "doctype": "Gatepass Item",
                    "idx": 1,
                    "parenttype": "Gatepass",
                    "owner": "ameer1982ahmad@gmail.com",
                    "docstatus": 1,
                    "quantity": 80,
                    "parentfield": "items"
    },
                {
                    "modified_by": "ameer1982ahmad@gmail.com",
                    "name": "abeccd721da274946658f2e01c7c4d3994d82cda25558692aceeaa40",
                    "parent": "P-GP/2075-Out",
                    "item": "EC47.5",
                    "creation": "2016-03-22 20:13:39.181818",
                    "modified": "2016-03-22 20:13:42.954506",
                    "doctype": "Gatepass Item",
                    "idx": 2,
                    "parenttype": "Gatepass",
                    "owner": "ameer1982ahmad@gmail.com",
                    "docstatus": 1,
                    "quantity": 75,
                    "parentfield": "items"
    }
  ],
            "route": "LUDHIANA TO BAHADURGARH",
            "modified": "2016-03-22 20:13:42.954506",
            "gatepass_type": "Out",
            "posting_date": "2016-03-22"
        }]

    this.addOpengatepass = 'k';
}

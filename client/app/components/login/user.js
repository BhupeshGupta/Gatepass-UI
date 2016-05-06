function userService($http, SettingsFactory, $rootScope, $q) {
    "ngInject";
    $rootScope.userLoaded = false;

    var factory = {
        login: function (usr, pwd) {
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
        get_startup_data: function () {
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

        loadUser: function (force) {
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
                }).catch(function () {
                    defferd.reject();
                    $rootScope.$broadcast('user:logout');
                })
            } else
                defferd.resolve();

            return defferd.promise;
        }

    };

    return factory;
};

export default userService;

import angular from 'angular';
/* @ngInject */
class LoginController {
    constructor($state, UserService, SettingsFactory, $scope, $rootScope) {
        this.$state = $state;
        this.UserService = UserService;
        this.SettingsFactory = SettingsFactory;
        this.$scope = $scope;
        this.$rootScope = $rootScope;

        console.log("Hi from Login Function");

        $scope.loginData = {
            username: '',
            password: ''
        }
    }

    login() {
        this.UserService.login(this.$scope.loginData.username, this.$scope.loginData.password).then(
            (response) => {
                var settings = this.SettingsFactory.get();
                settings.full_name = response.data.full_name;
                settings.sid = response.data.sid
                this.SettingsFactory.set(settings);
                this.$rootScope.$emit('login:success');
            }, (error) => {
                console.log(error);
            }
        );
    }
}

export default LoginController;

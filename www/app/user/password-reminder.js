(function () {
    'use strict';

    angular.module('cleanerApp').controller('passwordReminderCtrl', [
        '$scope',
        '$state',
        'appSettings',
        'userApi',
        passwordReminderCtrl]);

    function passwordReminderCtrl($scope, $state, appSettings, userApi) {
        var vm = this;

        initialize();

        function initialize() {
            if (userApi.isSignedIn()){
                $state.go("app.dashboard");
            }

            vm.userName = '';
            vm.password = '';
            vm.signIn = signIn;
        }

        function signIn(){
            if (!$scope.signinform.$valid) return;

            appSettings.showProgress("Signing In");

            var data = {
                username: vm.userName,
                password: vm.password
            }

            userApi.Customer.User.signin(data, function (response, exception) {
                if (response.success) {

                    appSettings.hideProgress();

                    // change location to another page
                    $state.go("app.dashboard");
                } else {
                    if (response.errorcode === 111) {
                        // redirect to setting page
                        $state.go("app.dashboard");
                    }
                    appSettings.showMessage(response.errormessage);
                }

            });
        }

    };
})();
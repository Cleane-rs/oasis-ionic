(function () {
    'use strict';

    angular.module('cleanerApp').controller('signUpCtrl',
        [
            '$scope',
            'userApi',
            'appSettings',
            '$state',
            signUpCtrl
        ]);

    function signUpCtrl($scope, userApi, appSettings, $state) {
        var vm = this;

        initialize();

        //userApi.Customer.User.signout();

        function initialize() {
            if (userApi.isSignedIn()) {
                $state.go("app.dashboard");
            }

            vm.userName = '';
            vm.password = '';
            vm.email = '';
            vm.confirmPassword = '';
            vm.firstName = '';
            vm.lastName = '';
            vm.phoneNo = '';
            vm.termsAndConditionChecked = false;
            vm.signUp = signUp;
            vm.checkTerms = checkTerms;
        }

        function checkTerms() {
            $scope.signupform.terms.$setValidity('required', vm.termsAndConditionChecked);
        }

        function signUp() {

            if (vm.termsAndConditionChecked) {
                // we set it manually if was not checked. we do not want to abstract user entering data.
                $scope.signupform.terms.$setValidity('required', true);
            }
            if (!$scope.signupform.$valid) return;

            if (!vm.termsAndConditionChecked) {
                $scope.signupform.terms.$setValidity('required', false);
                return;
            }

            appSettings.showProgress("Signing Up");

            var data = {
                username: vm.userName,
                password: vm.password,
                firstname: vm.firstName,
                lastname: vm.lastName,
                phone: vm.phoneNo,
                email : vm.email
            }

            userApi.Customer.User.signup(data, function (response, exception) {
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
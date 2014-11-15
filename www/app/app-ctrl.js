(function () {
    'use strict';

    angular.module('cleanerApp').controller('appCtrl', [
        '$state',
        'userApi',
        'cleanerApi',
        '$ionicActionSheet',
        '$ionicSideMenuDelegate',
        '$ionicNavBarDelegate',
        '$rootScope',
        'appSettings',
        appCtrl]);

    function appCtrl($state, userApi, cleanerApi, $ionicActionSheet, $ionicSideMenuDelegate, $ionicNavBarDelegate, $rootScope, appSettings) {
        var vm = this;
        vm.signOut = signOut;
        vm.isUserSignedIn = isUserSignedIn;
        vm.backButtonIsShown = false;

        function isUserSignedIn() {
            return userApi.isSignedIn();
        }

        $rootScope.$on('$viewHistory.historyChange', function(e, data) {
            if (data.showBack) {
                vm.backButtonIsShown = true;
            } else{
                vm.backButtonIsShown = false;
            }
        });

        function signOut() {

            if (!userApi.isSignedIn()) {
                $state.go("app.dashboard");
                return true;
            }

            $ionicActionSheet.show({
                titleText: 'Confirm',
                buttons: [
                    {text: 'Logout'},
                ],
                cancelText: 'Cancel',
                cancel: function () {
                },
                buttonClicked: function (index, $ionicPopup) {
                    appSettings.showProgress("Signing Out");
                    var options = {username: appSettings.username};
                    userApi.Customer.User.signout(options, function () {
                        cleanerApi.clearToken();
                        appSettings.hideProgress();
                        $state.go('app.dashboard');
                    });
                    appSettings.hideProgress();
                    return true;
                }
            });
        };
    };
})();
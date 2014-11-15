(function () {
    'use strict';

    angular.module("cleanerApp", [
        "ionic",
        "angular-data.DSCacheFactory",
        "google-maps"
        //"toastr"
    ]);

    angular.module("cleanerApp").run(function ($ionicPlatform, DSCacheFactory) {
        $ionicPlatform.ready(function () {
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            if (window.cordova && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            }
            if (window.StatusBar) {
                // org.apache.cordova.statusbar required
                StatusBar.styleDefault();
            }

        });
        DSCacheFactory("tokenCache", {storageMode: "localStorage", maxAge: 86400000, deleteOnExpire: "aggressive"});
        DSCacheFactory("staticCache", {storageMode: "localStorage"});
    });

})();
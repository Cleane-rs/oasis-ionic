(function () {
    'use strict';

    angular.module("cleanerApp").config(function ($stateProvider, $urlRouterProvider) {

        $stateProvider

            .state('app', {
                abstract: true,
                url: "/app",
                templateUrl: "app/layout/menu-layout.html"
            })

            .state('app.dashboard', {
                url: "/dashboard",
                views: {
                    'mainContent': {
                        templateUrl: "app/dashboard/home.html"
                    }
                }
            })

            .state('user', {
                abstract: true,
                url: "/user",
                templateUrl: "app/layout/menu-layout.html"
            })

            .state('user.signin', {
                url: "/signin",
                views: {
                    'mainContent': {
                        templateUrl: "app/user/signin.html"
                    }
                }
            })

            .state('user.signup', {
                url: "/signup",
                views: {
                    'mainContent': {
                        templateUrl: "app/user/signup.html"
                    }
                }
            })
            .state('user.settings', {
                url: "/settings",
                views: {
                    'mainContent': {
                        templateUrl: "app/user/settings.html"
                    }
                }
            })
            .state('user.preferences', {
                url: "/preferences",
                views: {
                    'mainContent': {
                        templateUrl: "app/user/preferences.html"
                    }
                }
            })
            .state('user.passwordreminder', {
                url: "/passwordreminder",
                views: {
                    'mainContent': {
                        templateUrl: "app/user/password-reminder.html"
                    }
                }
            });

        // if none of the above states are matched, use this as the fallback
        $urlRouterProvider.otherwise('/app/dashboard');
    });
})();
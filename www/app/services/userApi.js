(function () {
    'use strict';
    angular.module('cleanerApp').factory('userApi',
        [
            '$http',
            '$q',
            '$ionicLoading',
            'DSCacheFactory',
            'appSettings',
            'cleanerApi',
            userApi
        ]);

    function userApi($http, $q, $ionicLoading, DSCacheFactory, appSettings, cleanerApi) {
        var userService = {
                isSignedIn: isSignedIn
            },
            buildResponse = cleanerApi.buildResponse,
            sendAPIRequest = cleanerApi.sendApiRequest;

        function isSignedIn() {
            var tokenFromCache = cleanerApi.getTokenFromCache();
            return tokenFromCache && tokenFromCache != '';
        }

        // Customer
        (function () {

            var SECTION = "customer";

            /* USER */
            var SIGNIN = "signin";
            var SIGNUP = "signup";
            var SIGNOUT = "signout";
            var CHANGEPHONE = "changePhone";
            var VERIFYPHONE = "verifyPhone";
            var VERIFYEMAIL = "verifyEmail";

            /* LOCATIONS */
            var ADDLOCATION = "addLocation";

            /* ANALYTICS */
            var GEOIPLOOKUP = "geoiplookup";

            userService.Customer = {

                User: {
                    /**
                     * Log in a customer and return the customer token
                     * @param options    The options:  { email:, password:, fields: { } }
                     * @param callback    Your callback function(response)
                     */
                    signin: function (options, callback) {
                        if (appSettings.token !== "" || appSettings.username !== "") {
                            if (callback)
                                var result = {
                                    success: false,
                                    errorcode: 111
                                };
                            return callback(buildResponse(result));
                        }
                        else {
                            sendAPIRequest(SECTION, SIGNIN, signinComplete, callback, options);
                        }
                    },

                    /**
                     * Create a new customer
                     * @param options    The options:  { email*, password*,phone*,firstname*,lastname* }
                     * @param callback    Your callback function(response)
                     */
                    signup: function (options, callback) {
                        if (appSettings.token !== "") {
                            if (callback)
                                var result = {
                                    success: false,
                                    errorcode: 111
                                };
                            return callback(buildResponse(result));
                        }
                        else {
                            sendAPIRequest(SECTION, SIGNUP, signupComplete, callback, options);
                        }
                    },

                    /**
                     * Customer signout
                     * @param options    The options:  { fields: { } }
                     * @param callback    Your callback function(response)
                     */
                    signout: function (options, callback) {
                        sendAPIRequest(SECTION, SIGNOUT, signoutComplete, callback, options);
                    },

                    /**
                     * Change customer phone number & send verification SMS
                     * @param options    The options:  { phone* }
                     * @param callback    Your callback function(response)
                     */
                    changePhone: function (options, callback) {
                        sendAPIRequest(SECTION, CHANGEPHONE, changePhoneComplete, callback, options);
                    },

                    /**
                     * Verify customer phone number with verification code
                     * @param options    The options:  { phone*, verificationCode* }
                     * @param callback    Your callback function(response)
                     */
                    verifyPhone: function (options, callback) {
                        sendAPIRequest(SECTION, VERIFYPHONE, verifyPhoneComplete, callback, options);
                    },

                    /**
                     * Verify customer email with verification code
                     * @param options    The options:  { verificationCode* }
                     * @param callback    Your callback function(response)
                     */
                    verifyEmail: function (options, callback) {
                        sendAPIRequest(SECTION, VERIFYEMAIL, verifyEmailComplete, callback, options);
                    }

                },
                Location: {
                    /**
                     * Validate then Add new address to User
                     * @param options {alias*, unitNumber, mainAddress*, postalCode*, driverInstruction, isPrimary}
                     * @param callback Your function to receive the data:  callback(response, data);
                     */
                    add: function (options, callback) {
                        sendAPIRequest(SECTION, ADDLOCATION, addLocationComplete, callback, options);
                    }

                },
                Analytics: {
                    /**
                     * Performs a country lookup on the customer IP address
                     * @param    callback    Your function to receive the data:  callback(data, response);
                     */
                    geoipLookup: function (callback) {
                        sendAPIRequest(SECTION, GEOIPLOOKUP, geoipLookupComplete, callback, null);
                    }
                }
            }


            /**
             * Processes the response received from the server, returns the data and response to the user's callback
             * @param    callback    The user's callback function
             * @param    postdata    The data that was posted
             * @param    data        The object returned from the server
             * @param    response    The response from the server
             */
            function signinComplete(callback, postdata, data, response) {

                if (response.success) {
                    appSettings.token = data.token;
                    appSettings.username = postdata.username;
                    cleanerApi.setToken(data.token);
                }

                if (callback == null)
                    return;

                callback(response, data);
            }

            function signupComplete(callback, postdata, data, response) {

                if (response.success) {
                    appSettings.token = data.token;
                    appSettings.username = postdata.username;
                    cleanerApi.setToken(data.token);
                }

                if (callback == null)
                    return;

                callback(response, data);
            }

            function signoutComplete(callback, postdata, data, response) {

                if (response.success) {
                    appSettings.token = "";
                    appSettings.username = "";
                    cleanerApi.clearToken();
                }

                if (callback == null)
                    return;

                callback(response, data);
            }

            function addLocationComplete(callback, postdata, data, response) {

                if (callback == null)
                    return;

                callback(response, data);
            }

            function changePhoneComplete(callback, postdata, data, response) {
                if (callback == null) {
                    return;
                }

                if (response.success == false) {
                    callback(response, null);
                    return;
                }

                callback(response, data);
            }

            function verifyPhoneComplete(callback, postdata, data, response) {
                if (callback == null) {
                    return;
                }

                if (response.success == false) {
                    callback(response, null);
                    return;
                }

                callback(response, data);
            }

            function verifyEmailComplete(callback, postdata, data, response) {
                if (callback == null) {
                    return;
                }

                if (response.success == false) {
                    callback(response, null);
                    return;
                }

                callback(response, data);
            }

            function geoipLookupComplete(callback, postdata, data, response) {
                if (callback == null) {
                    return;
                }

                if (response.success == false) {
                    callback(response, null);
                    return;
                }

                callback(response, data);
            }
        })();

        return userService;
    };
})
();
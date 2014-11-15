(function () {
    'use strict';

    angular.module('cleanerApp').factory('cleanerApi',
        [
            '$http',
            '$q',
            '$ionicLoading',
            'DSCacheFactory',
            'appSettings',
            cleanerApi
        ]);

    function cleanerApi($http, $q, $ionicLoading, DSCacheFactory, appSettings) {

        var tokenCacheKey = "tokenData";

        var service = {
            getToken: getToken,
            setToken: setToken,
            clearToken: clearToken,
            sendApiRequest: sendApiRequest,
            buildResponse: buildResponse,
            getTokenFromCache: getTokenFromCache
        };

        self.tokenCache = DSCacheFactory.get("tokenCache");

        getToken().then(function (data) {
            appSettings.token = data;
        });


        self.tokenCache.setOptions({
            onExpire: function (key, value) {
                getToken()
                    .then(function () {
                        console.log("Token Cache was automatically refreshed.", new Date());
                    }, function () {
                        console.log("Error getting data. Putting expired item back in the cache.", new Date());
                        self.tokenCache.put(key, value);
                    });
            }
        });

        function clearToken() {
            self.tokenCache.remove(tokenCacheKey);
            appSettings.token = '';
            appSettings.username = '';
        }

        function setToken(token) {
            if (!token) return;
            var tokenData = token;
            self.tokenCache.put(tokenCacheKey, tokenData);
        }

        function getTokenFromCache() {
            return self.tokenCache.get(tokenCacheKey);
        }

        function getToken(forceRefresh) {
            if (typeof forceRefresh === "undefined") {
                forceRefresh = false;
            }

            var deferred = $q.defer(),
                tokenData = null;

            if (!forceRefresh) {
                tokenData = self.tokenCache.get(tokenCacheKey);
            }

            if (tokenData) {
                //console.log("Found data in cache", tokenData);
                deferred.resolve(tokenData);
            } else {
                //console.log("Value was not found in cache. get back to caller and let him decide what to do");
                deferred.reject();
            }
            return deferred.promise;
        }

        /**
         * Private method to send API request
         * @param section
         * @param action
         * @param complete
         * @param callback
         * @param postdata
         */
        function sendApiRequest(section, action, complete, callback, postdata) {

            postdata = postdata || {};
            postdata.section = section;
            postdata.action = action;
            postdata.publickey = appSettings.publicKey;
            postdata.token = appSettings.token;

            if (postdata.username && appSettings.username !== "" && postdata.action != 'signout') console.log("Username token is already set, signout first before using a new user");
            if (postdata.username && appSettings.username == "" && postdata.action == 'signout') console.log("Username token is missing, signin or signup first before signing out");

            postdata.username = appSettings.username !== "" ? appSettings.username : postdata.username;

            var json = JSON.stringify(postdata);
            var pda = "data=" + appSettings.encode.base64(json) + "&hash=" + appSettings.encode.md5(json + appSettings.privateKey);
            var request = window.XDomainRequest ? new XDomainRequest() : new XMLHttpRequest();

            request.onerror = function () {
                complete(callback, postdata, {}, buildResponse(false, 999));
            };

            request.onload = function () {
                var result;
                try {
                    result = JSON.parse(request.responseText);
                }
                catch (e) {
                    console.log(request);
                }

                //clean data and response objects
                var resp = buildResponse(JSON.parse(JSON.stringify(result)));

                delete result.success;
                delete result.errorcode;
                delete result.errormessage;
                delete result.debug;
                delete result.exception;

                complete(callback, postdata, result, resp);
            };

            if (window.XDomainRequest) {
                request.open("POST", appSettings.apiUrl);
            }
            else {
                request.open("POST", appSettings.apiUrl, true);
            }

            request.send(pda);
        }

        /**
         * Private method to build a response
         * @param result
         * @returns reponse struct
         * @constructor
         */
        function buildResponse(result) {
            var struct = {
                success: result.success,
                errorcode: result.errorcode,
                errormessage: appSettings.errorCodes[result.errorcode]
            };

            if (result.debug) {
                struct.debug = result.debug;
            }

            if (result.exception) {
                struct.exception = result.exception;
            }

            return struct;
        }


        return service;
    }
})();
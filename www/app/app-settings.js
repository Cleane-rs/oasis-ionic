(function () {
    'use strict';

    angular.module('cleanerApp').factory('appSettings',
        [
            '$http',
            '$q',
            '$ionicLoading',
            'DSCacheFactory',
            appSettings
        ]);

    function appSettings($http, $q, $ionicLoading, DSCacheFactory) {

        var publicKey = "aaaaaaaaaaaaaaaa",
            privateKey = "111111111111111111111111",
            //url = "http://127.0.0.1:3001/",
            url = 'http://cleanservice.cloudapp.net:3001/',
            errorCodes = responseErrorCodes(),
            encode = requestEncode(),
            token = '',
            username = '';

        var service = {
            responseErrorCodes: responseErrorCodes,
            apiUrl: getApiUrl(),
            publicKey: getPublicKey(),
            privateKey: getPrivateKey(),
            token: token,
            username: username,
            encode: encode,
            errorCodes: errorCodes,
            initializeApiSettings: initializeApiSettings,
            showMessage: showMessage,
            showProgress: showProgress,
            hideProgress: hideProgress
        };


        /**
         * Initializes the API
         * @param    publickey    Platform's public key
         * @param    privatekey    Platform's private key
         * @param    apiurl        The url to the server
         */
        function initializeApiSettings(publickey, privatekey, apiurl) {
            url = apiurl;
            privateKey = privatekey;
            publicKey = publickey;
        };

        /**
         * Builds Api Url
         * @param apiUrl default to url (127.0.0.1:3001)
         * @returns {string}
         */
        function getApiUrl(apiUrl) {
            apiUrl = apiUrl || url;
            if (apiUrl.lastIndexOf("/") != apiUrl.length - 1) {
                apiUrl += "/";
            }

            return apiUrl + "v1?publickey=" + publicKey;
        }

        /**
         * Returns Public Key
         * @returns {string}
         */
        function getPublicKey() {
            return publicKey;
        }

        /**
         * Returns Private Key
         * @returns {string}
         */
        function getPrivateKey() {
            return privateKey;
        }

        function responseErrorCodes() {
            return {

                // General Errors
                "0": "No error",
                "1": "General error, this typically means the client is unable to connect",
                "2": "The Public Key is expected in all service requests",
                "3": "Invalid platform, make sure keys point to valid platforms",
                "4": "This platform has beend disabled",
                "5": "The request doesn't decode based on the expected private key. Possible tampered request.",
                "6": "The request was decrypted but the payload is not valid JSON data.",
                "7": "The platform doesn't have access to the requested section",
                "8": "The requested section doesn't exist",
                "9": "Timeout occured",

                //User
                "100": "There was a general user problem",
                "101": "User provided invalid username or password",
                "102": "Error while invalidating existing auth token",
                "103": "Error occurred during the crypto token generation",
                "104": "User must be signed in to perform this action",
                "105": "Can't perform sign-in or sign-up when signed-in",
                "106": "There is no user by that email",
                "107": "The password doesn't match the users password",
                "108": "User must supply all required fields",
                "109": "User with that email already exists",
                "110": "User created but unable to auto sign in",
                "111": "User already signed in. Must sign out first",

                //Phone
                "150": "Change phone number is missing the new phone number",
                "151": "Failed to resend verification code to user's phone",
                "152": "Missing required verification code",
                "153": "Phone number is different than verification number",
                "154": "Submitted verification code doesn't match",

                //Email
                "170": "Missing required verification code",
                "171": "Submitted verification code doesn't match",

                //Location
                "200": "Location is missing required fields",
                "201": "Main Address field cannot be parsed",
                "202": "Unit number cannot be parsed",
                "203": "Location entered looks fine but address doesn't exist in our system",
                "204": "Multi-unit building was found but the user did not supply a unit number",
                "205": "Location fields were valid but the address couldn't be saved",

                //Token
                "300": "Token must be passed to secured services",
                "301": "Token has expired, user must log in",


                "999": "General error in AJAX request, requestlikely didn't hit the services"
            };
        }

        // encoding is derived from these two sources:
        // Base64 encoding: http://www.webtoolkit.info/javascript-base64.html
        // MD5 encoding: Version 2.2 Copyright (C) Paul Johnston 1999 - 2009 See http://pajhome.org.uk/crypt/md5 for more info.
        function requestEncode() {
            return (new function () {
                var _keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
                var hex_chr = "0123456789abcdef";

                return {
                    base64: function (str) {
                        var output = "";
                        var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
                        var i = 0;

                        str = _utf8_encode(str);

                        while (i < str.length) {
                            chr1 = str.charCodeAt(i++);
                            chr2 = str.charCodeAt(i++);
                            chr3 = str.charCodeAt(i++);
                            enc1 = chr1 >> 2;
                            enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
                            enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
                            enc4 = chr3 & 63;

                            if (isNaN(chr2)) {
                                enc3 = enc4 = 64;
                            } else if (isNaN(chr3)) {
                                enc4 = 64;
                            }

                            output = output + _keyStr.charAt(enc1) + _keyStr.charAt(enc2) + _keyStr.charAt(enc3) + _keyStr.charAt(enc4);
                        }

                        return output;
                    },

                    md5: function (str) {
                        var x = str2blks_MD5(str);
                        var a = 1732584193;
                        var b = -271733879;
                        var c = -1732584194;
                        var d = 271733878;

                        for (var i = 0; i < x.length; i += 16) {
                            var olda = a;
                            var oldb = b;
                            var oldc = c;
                            var oldd = d;

                            a = ff(a, b, c, d, x[i + 0], 7, -680876936);
                            d = ff(d, a, b, c, x[i + 1], 12, -389564586);
                            c = ff(c, d, a, b, x[i + 2], 17, 606105819);
                            b = ff(b, c, d, a, x[i + 3], 22, -1044525330);
                            a = ff(a, b, c, d, x[i + 4], 7, -176418897);
                            d = ff(d, a, b, c, x[i + 5], 12, 1200080426);
                            c = ff(c, d, a, b, x[i + 6], 17, -1473231341);
                            b = ff(b, c, d, a, x[i + 7], 22, -45705983);
                            a = ff(a, b, c, d, x[i + 8], 7, 1770035416);
                            d = ff(d, a, b, c, x[i + 9], 12, -1958414417);
                            c = ff(c, d, a, b, x[i + 10], 17, -42063);
                            b = ff(b, c, d, a, x[i + 11], 22, -1990404162);
                            a = ff(a, b, c, d, x[i + 12], 7, 1804603682);
                            d = ff(d, a, b, c, x[i + 13], 12, -40341101);
                            c = ff(c, d, a, b, x[i + 14], 17, -1502002290);
                            b = ff(b, c, d, a, x[i + 15], 22, 1236535329);
                            a = gg(a, b, c, d, x[i + 1], 5, -165796510);
                            d = gg(d, a, b, c, x[i + 6], 9, -1069501632);
                            c = gg(c, d, a, b, x[i + 11], 14, 643717713);
                            b = gg(b, c, d, a, x[i + 0], 20, -373897302);
                            a = gg(a, b, c, d, x[i + 5], 5, -701558691);
                            d = gg(d, a, b, c, x[i + 10], 9, 38016083);
                            c = gg(c, d, a, b, x[i + 15], 14, -660478335);
                            b = gg(b, c, d, a, x[i + 4], 20, -405537848);
                            a = gg(a, b, c, d, x[i + 9], 5, 568446438);
                            d = gg(d, a, b, c, x[i + 14], 9, -1019803690);
                            c = gg(c, d, a, b, x[i + 3], 14, -187363961);
                            b = gg(b, c, d, a, x[i + 8], 20, 1163531501);
                            a = gg(a, b, c, d, x[i + 13], 5, -1444681467);
                            d = gg(d, a, b, c, x[i + 2], 9, -51403784);
                            c = gg(c, d, a, b, x[i + 7], 14, 1735328473);
                            b = gg(b, c, d, a, x[i + 12], 20, -1926607734);
                            a = hh(a, b, c, d, x[i + 5], 4, -378558);
                            d = hh(d, a, b, c, x[i + 8], 11, -2022574463);
                            c = hh(c, d, a, b, x[i + 11], 16, 1839030562);
                            b = hh(b, c, d, a, x[i + 14], 23, -35309556);
                            a = hh(a, b, c, d, x[i + 1], 4, -1530992060);
                            d = hh(d, a, b, c, x[i + 4], 11, 1272893353);
                            c = hh(c, d, a, b, x[i + 7], 16, -155497632);
                            b = hh(b, c, d, a, x[i + 10], 23, -1094730640);
                            a = hh(a, b, c, d, x[i + 13], 4, 681279174);
                            d = hh(d, a, b, c, x[i + 0], 11, -358537222);
                            c = hh(c, d, a, b, x[i + 3], 16, -722521979);
                            b = hh(b, c, d, a, x[i + 6], 23, 76029189);
                            a = hh(a, b, c, d, x[i + 9], 4, -640364487);
                            d = hh(d, a, b, c, x[i + 12], 11, -421815835);
                            c = hh(c, d, a, b, x[i + 15], 16, 530742520);
                            b = hh(b, c, d, a, x[i + 2], 23, -995338651);
                            a = ii(a, b, c, d, x[i + 0], 6, -198630844);
                            d = ii(d, a, b, c, x[i + 7], 10, 1126891415);
                            c = ii(c, d, a, b, x[i + 14], 15, -1416354905);
                            b = ii(b, c, d, a, x[i + 5], 21, -57434055);
                            a = ii(a, b, c, d, x[i + 12], 6, 1700485571);
                            d = ii(d, a, b, c, x[i + 3], 10, -1894986606);
                            c = ii(c, d, a, b, x[i + 10], 15, -1051523);
                            b = ii(b, c, d, a, x[i + 1], 21, -2054922799);
                            a = ii(a, b, c, d, x[i + 8], 6, 1873313359);
                            d = ii(d, a, b, c, x[i + 15], 10, -30611744);
                            c = ii(c, d, a, b, x[i + 6], 15, -1560198380);
                            b = ii(b, c, d, a, x[i + 13], 21, 1309151649);
                            a = ii(a, b, c, d, x[i + 4], 6, -145523070);
                            d = ii(d, a, b, c, x[i + 11], 10, -1120210379);
                            c = ii(c, d, a, b, x[i + 2], 15, 718787259);
                            b = ii(b, c, d, a, x[i + 9], 21, -343485551);

                            a = addme(a, olda);
                            b = addme(b, oldb);
                            c = addme(c, oldc);
                            d = addme(d, oldd);
                        }

                        return rhex(a) + rhex(b) + rhex(c) + rhex(d);
                    }
                };

                function _utf8_encode(string) {

                    if (!string) {
                        return "";
                    }

                    string = string.replace(/\r\n/g, "\n");
                    var utftext = "";

                    for (var n = 0; n < string.length; n++) {
                        var c = string.charCodeAt(n);

                        if (c < 128) {
                            utftext += String.fromCharCode(c);
                        }
                        else if ((c > 127) && (c < 2048)) {
                            utftext += String.fromCharCode((c >> 6) | 192);
                            utftext += String.fromCharCode((c & 63) | 128);
                        }
                        else {
                            utftext += String.fromCharCode((c >> 12) | 224);
                            utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                            utftext += String.fromCharCode((c & 63) | 128);
                        }
                    }

                    return utftext;
                }

                function bitOR(a, b) {
                    var lsb = (a & 0x1) | (b & 0x1);
                    var msb31 = (a >>> 1) | (b >>> 1);

                    return (msb31 << 1) | lsb;
                }

                function bitXOR(a, b) {
                    var lsb = (a & 0x1) ^ (b & 0x1);
                    var msb31 = (a >>> 1) ^ (b >>> 1);

                    return (msb31 << 1) | lsb;
                }

                function bitAND(a, b) {
                    var lsb = (a & 0x1) & (b & 0x1);
                    var msb31 = (a >>> 1) & (b >>> 1);

                    return (msb31 << 1) | lsb;
                }

                function addme(x, y) {
                    var lsw = (x & 0xFFFF) + (y & 0xFFFF);
                    var msw = (x >> 16) + (y >> 16) + (lsw >> 16);

                    return (msw << 16) | (lsw & 0xFFFF);
                }

                function rhex(num) {
                    var str = "";
                    var j;

                    for (j = 0; j <= 3; j++)
                        str += hex_chr.charAt((num >> (j * 8 + 4)) & 0x0F) + hex_chr.charAt((num >> (j * 8)) & 0x0F);

                    return str;
                }

                function str2blks_MD5(str) {
                    var nblk = ((str.length + 8) >> 6) + 1;
                    var blks = new Array(nblk * 16);
                    var i;

                    for (i = 0; i < nblk * 16; i++) {
                        blks[i] = 0;
                    }

                    for (i = 0; i < str.length; i++) {
                        blks[i >> 2] |= str.charCodeAt(i) << (((str.length * 8 + i) % 4) * 8);
                    }

                    blks[i >> 2] |= 0x80 << (((str.length * 8 + i) % 4) * 8);

                    var l = str.length * 8;
                    blks[nblk * 16 - 2] = (l & 0xFF);
                    blks[nblk * 16 - 2] |= ((l >>> 8) & 0xFF) << 8;
                    blks[nblk * 16 - 2] |= ((l >>> 16) & 0xFF) << 16;
                    blks[nblk * 16 - 2] |= ((l >>> 24) & 0xFF) << 24;

                    return blks;
                }

                function rol(num, cnt) {
                    return (num << cnt) | (num >>> (32 - cnt));
                }

                function cmn(q, a, b, x, s, t) {
                    return addme(rol((addme(addme(a, q), addme(x, t))), s), b);
                }

                function ff(a, b, c, d, x, s, t) {
                    return cmn(bitOR(bitAND(b, c), bitAND((~b), d)), a, b, x, s, t);
                }

                function gg(a, b, c, d, x, s, t) {
                    return cmn(bitOR(bitAND(b, d), bitAND(c, (~d))), a, b, x, s, t);
                }

                function hh(a, b, c, d, x, s, t) {
                    return cmn(bitXOR(bitXOR(b, c), d), a, b, x, s, t);
                }

                function ii(a, b, c, d, x, s, t) {
                    return cmn(bitXOR(c, bitOR(b, (~d))), a, b, x, s, t);
                }

            }());
        }

        // Triggered on a button click, or some other target
        function showMessage(errormessage) {
            console.log('1- ' + errormessage);
            $ionicLoading.show({
                template: "<div class='loading-text'>" +
                "<div class='row'> " +
                "<div class='col col-10 loading-thumb-container'>" +
                "<i class='icon icon-attention-3' ></i>" +
                "</div> <div class='col col-90'>" +
                "<h4 class='black-text'>" + errormessage + "</h4>" +
                "</div> </div>" +
                "</div>",
                animation: 'fade-in',
                showBackdrop: false,
                maxWidth: 200,
                showDelay: 500,
                //template: errormessage,
                //noBackdrop: true,
                duration: 2000
            });
        };

        function showProgress(message) {
            $ionicLoading.show({
                template: '<i class="icon ion-loading-c"></i> ' + message,
                animation: 'fade-in',
                showBackdrop: true,
                maxWidth: 200,
                showDelay: 0
            });
        }

        function hideProgress() {
            $ionicLoading.hide();
        }


        return service;
    }

})();

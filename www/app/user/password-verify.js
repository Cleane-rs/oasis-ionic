(function() {
    'use strict';

    var directiveName = 'match';
    angular.module('cleanerApp').directive(directiveName, [
        '$parse',
        passwordVerify
    ]);

    /**
     * a directive to verify a confirm password mtaches a password
     * @param $parse
     * @returns {{require: string, link: Function}}
     */
    function passwordVerify($parse) {
        var directive = {
            require: 'ngModel',
            link: function(scope, elem, attrs, ctrl) {
                scope.$watch(function () {
                    if (!ctrl.$viewValue || ctrl.$viewValue ==='') {
                        ctrl.$setValidity('mismatch', true);
                    }
                    if (!ctrl.$touched) return true;
                    var parts = attrs.match.split('.');
                    // look for first part in scope or scope's parents
                    var tempScope = scope;
                    var val = tempScope[parts[0]];
                    while (true) {
                        if (val) {
                            break;
                        }
                        tempScope = tempScope.$parent;
                        if (!tempScope) {
                            break;
                        }
                        val = tempScope[parts[0]];
                    }
                    for (var i = 1; i < parts.length; i++) {
                        if (val) {
                            val = val[parts[i]];
                        } else {
                            break;
                        }
                    }
                    if (!val || !ctrl) {
                        return false;
                    }

                    if (!ctrl.$viewValue || ctrl.$viewValue === '' ) return true;
                    return val === ctrl.$viewValue; // replaced for return val.viewValue === ctrl.$viewValue; // because of ionic isolated scope.
                }, function(currentValue) {
                    ctrl.$setValidity('mismatch', currentValue);
                });
            }
        };
        return directive;
    }
})();
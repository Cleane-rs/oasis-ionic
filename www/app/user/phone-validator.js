(function () {
    'use strict';

    var directiveName = 'phone';
    angular.module('cleanerApp').directive(directiveName, [
        '$parse',
        phoneValidator
    ]);

    /**
     * a directive to verify a confirm password mtaches a password
     * @returns {{require: string, link: Function}}
     */
    function phoneValidator() {

        var phoneRegExp = /((\(\d{3}\)?)|(\d{3}))([\s\-\./]?)(\d{3})([\s\-\./]?)(\d{4})$/;

        return {
            restrict: 'A',
            require: 'ngModel',
            link: function (scope, element, attrs, ctrl) {
                var value = ctrl.$viewValue,
                    isValid;

                /**
                 * Watch for blur to format and render if valid
                 */
                element.bind('blur', function () {
                    if (!ctrl.$touched) {
                        //assessCtrl();
                    }
                    ctrl.$setViewValue(!!isValid ? formatPhone() : unformatPhone());
                    ctrl.$render();

                });

                /**
                 * Watch for focus to unformat and re-render
                 */
                element.bind('focus', function () {
                    ctrl.$setViewValue(unformatPhone());
                    ctrl.$render();
                });

                function assessCtrl(){
                    value = ctrl.$viewValue;
                    if (!value || value == '') {
                        isValid = true;
                    }
                    else {
                        isValid = !!phoneRegExp.test(value);
                    }
                    if (!ctrl.$touched) return;
                    ctrl.$setValidity('phoneNo', isValid);
                }

                /**
                 * Format number. this should be called only if valid
                 */
                function formatPhone() {
                    var value = ctrl.$viewValue;
                    if (!value) return value;
                    var numbers = value.replace(/\D/g, ''),
                        char = {0: '(', 3: ') ', 6: '-'};
                    value = '';
                    for (var i = 0; i < numbers.length; i++) {
                        value += (char[i] || '') + numbers[i];
                    }

                    return value;
                }

                /**
                 * Un-format number
                 */
                function unformatPhone() {
                    var value = ctrl.$viewValue;
                    if (!value) return value;
                    value = value.replace('-', '').replace(' ', '').replace('(', '').replace(')', '');
                    return value;
                }

                /**
                 * Watch and set validity if touched only
                 */
                scope.$watch(function () {
                //    value = ctrl.$viewValue;
                    if (!ctrl.$touched) return;
                    assessCtrl();
                });
            }
        }
    }
})();


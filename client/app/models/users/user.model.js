(function () {
    'use strict';

    angular.module('app.users')
        .factory('User', ['$http', function () {
            function User(userData) {
                if (userData) {
                    this.setData(userData);
                }
            }

            User.prototype = {
                setData: function (userData) {
                    angular.extend(this, userData);
                }
            };

            return User;
        }]);
})();
(function () {
    'use strict';

    angular.module('app.users')
        .factory('User', ['$http', function ($http) {
            function User(userData) {
                if (userData) {
                    this.setData(userData);
                }
            }

            User.prototype = {
                setData: function (userData) {
                    angular.extend(this, userData);
                },
                delete: function (userId) {
                    $http.delete('ourserver/users/' + userId);
                },
                update: function (userId) {
                    $http.put('ourserver/users/' + userId, this);
                }
            };

            return User;
        }]);
})();
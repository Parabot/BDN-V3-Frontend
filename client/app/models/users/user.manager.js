(function () {
    'use strict';

    angular.module('app.users')
        .factory('userManager', ['$q', 'User', 'appConfig', 'appCommon', userManager]);

    function userManager($q, User, appConfig, appCommon) {

        return {
            _totalLastSearch: 0,
            _pool: {},

            _retrieveInstance: function (userId, userData) {
                var instance = this._pool[userId];

                if (instance) {
                    instance.setData(userData);
                } else {
                    instance = new User(userData);
                    this._pool[userId] = instance;
                }

                return instance;
            },

            _search: function (userId) {
                return this._pool[userId];
            },

            _searchByUsername: function (username) {
                var users = [];
                angular.forEach(this._pool, function (value, key) {
                    if (value.hasOwnProperty('username') && value.username.indexOf(username) !== -1) {
                        users.push(value);
                    }
                });

                return users;
            },

            _load: function (userId, deferred) {
                var scope = this;

                appCommon.getURL.get(appConfig.endpoints.userGet + userId)
                    .success(function (userData) {
                        var user = scope._retrieveInstance(userData.id, userData);
                        deferred.resolve(user);
                    })
                    .error(function () {
                        deferred.reject();
                    });
            },

            getTotalForLatestRetrieval: function () {
                var deferred = $q.defer();
                deferred.resolve(this._totalLastSearch);
                return deferred.promise;
            },

            getUser: function (userId) {
                var deferred = $q.defer();
                var user = this._search(userId);
                if (user) {
                    deferred.resolve(user);
                } else {
                    this._load(userId, deferred);
                }
                return deferred.promise;
            },

            loadUsers: function (page, key, value) {
                var deferred = $q.defer();
                var scope = this;
                var url = (key != null && value != null ? appConfig.endpoints.usersSearch + key + '/' + value + '?page=' + page : appConfig.endpoints.usersList + page);
                appCommon.getURL(
                    url, function (usersArray) {
                        var users = [];
                        usersArray['result'].forEach(function (userData) {
                            var user = scope._retrieveInstance(userData.id, userData);
                            users.push(user);
                        });
                        scope._totalLastSearch = usersArray['total'];

                        deferred.resolve(users);
                    }, true, true, function () {
                        deferred.reject();
                    }
                );
                return deferred.promise;
            },

            setUser: function (userData) {
                var scope = this;
                var user = this._search(userData.id);
                if (user) {
                    user.setData(userData);
                } else {
                    user = scope._retrieveInstance(userData);
                }
                return user;
            }

        };
    }
})();
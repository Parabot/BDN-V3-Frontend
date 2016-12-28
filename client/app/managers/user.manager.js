(function () {
    'use strict';

    angular.module('app.users')
        .factory('userManager', ['$q', 'User', 'appConfig', 'appCommon', userManager]);

    function userManager($q, User, appConfig, appCommon) {

        return {
            _totalLastSearch: 0,
            _pool: {},
            _myUserId: null,

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

            _load: function (userId, deferred) {
                var scope = this;

                appCommon.getURL(appConfig.endpoints.userGet + userId,
                    function (userData) {
                        var user = scope._retrieveInstance(userData.id, userData);
                        deferred.resolve(user);
                    }, true, true, function () {
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

            getMyUser: function () {
                var deferred = $q.defer();
                var scope = this;

                if (this._myUserId == null) {
                    appCommon.getURL(appConfig.endpoints.getMy.id,
                        function (userData) {
                            scope._myUserId = userData.result.id;
                            scope._load(scope._myUserId, deferred);
                        }, true, true, function () {
                            deferred.reject();
                        });
                }else{
                    var user = this._search(this._myUserId);
                    if (user) {
                        deferred.resolve(user);
                    } else {
                        this._load(this._myUserId, deferred);
                    }
                }

                return deferred.promise;
            }

        };
    }
})();
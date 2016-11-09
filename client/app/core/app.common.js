(function () {
    'use strict';

    angular.module('app.core')
        .config(function ($httpProvider) {
            $httpProvider.defaults.withCredentials = true;
            //rest of route code
        })
        .service('appCommon', function ($http, $location, appConfig, $window) {
            this.getURL = function ($url, $callback) {
                $http.get($url).success($callback);
            };

            this.postURL = function ($url, $callback, $data) {
                $http.post($url, $data).success($callback);
            };

            var redirectToLogin = function () {
                $window.location.href = appConfig.endpoints['login'];
            };

            this.checkLoggedIn = function () {
                var callbackRedirect = function ($data) {
                    if (typeof $data['result'] !== 'undefined') {
                        if ($data['result'] === false) {
                            redirectToLogin();
                        }
                    }
                };

                this.isLoggedIn(callbackRedirect);
            };

            this.isLoggedIn = function ($callback) {
                this.getURL(appConfig.endpoints['isLoggedIn'], $callback);
            }
        });
})();
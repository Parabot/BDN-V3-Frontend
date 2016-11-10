(function () {
    'use strict';

    angular.module('app.core')
        .config(function ($httpProvider) {
            $httpProvider.defaults.withCredentials = true;
            //rest of route code
        })
        .service('appCommon', function ($http, $location, $rootScope, appConfig, $window) {
            this.getURL = function ($url, $callback) {
                $http.get($url).success($callback);
            };

            this.postURL = function ($url, $callback, $data) {
                $http.post($url, $data).success($callback);
            };

            var redirectToLogin = function () {
                $window.location.href = appConfig.endpoints['login'];
            };

            var showLoaderFunction = function () {
                $rootScope.$broadcast('preloader:active');
            };

            var hideLoaderFunction = function () {
                $rootScope.$broadcast('preloader:hide');
            };

            this.showLoader = function(){
                showLoaderFunction();
            };

            this.hideLoader = function(){
                hideLoaderFunction();
            };

            this.checkLoggedIn = function ($callback) {
                if ($callback == null) {
                    $callback = function ($data) {
                        if (typeof $data['result'] !== 'undefined') {
                            if ($data['result'] === false) {
                                redirectToLogin();
                            }
                        }
                        hideLoaderFunction();
                    };
                }

                this.showLoader();
                this.isLoggedIn($callback);
            };

            this.isLoggedIn = function ($callback) {
                this.getURL(appConfig.endpoints['isLoggedIn'], $callback);
            }
        });
})();
(function () {
    'use strict';

    angular.module('app.core')
        .config(function ($httpProvider) {
            $httpProvider.defaults.withCredentials = true;
            //rest of route code
        })
        .service('appCommon', function ($http, $location, $rootScope, appConfig, $window) {
            $rootScope.loggedInChecked = false;

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

            this.showLoader = function () {
                showLoaderFunction();
            };

            this.hideLoader = function () {
                hideLoaderFunction();
            };

            this.checkLoggedIn = function ($callback) {
                if ($rootScope.loggedInChecked !== true) {

                    var loginCallBack = function ($data) {
                        if (typeof $data === 'undefined' || typeof $data['result'] === 'undefined' || $data['result'] === false) {
                            redirectToLogin();
                        }else{
                            $rootScope.loggedInChecked = true;
                        }
                    };

                    var afterLoginCheck = null;

                    if ($callback == null) {
                        afterLoginCheck = loginCallBack;
                    }else{
                        afterLoginCheck = function ($data) {
                            loginCallBack($data);
                            $callback();
                        }
                    }

                    this.showLoader();
                    this.isLoggedIn(afterLoginCheck);
                }else{
                    $callback();
                }
            };

            this.isLoggedIn = function ($callback) {
                this.getURL(appConfig.endpoints['isLoggedIn'], $callback);
            }
        });
})();
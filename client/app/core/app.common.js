(function () {
    'use strict';

    angular.module('app.core')
        .service('appCommon', function ($http, $location, $rootScope, appConfig, appUICommon, $window) {
            $rootScope.loggedInChecked = false;

            this.getURL = function ($url, $callback) {
                $http.get($url).success($callback).error(handleURLError);
            };

            this.postURL = function ($url, $callback, $data) {
                var request = {
                    url: $url,
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    data: $data
                };

                $http(request).success($callback).error(handleURLError);
            };
            
            var handleURLError = function ($data, $code) {
                var append = '';
                if (typeof $data !== 'undefined' && typeof $data['result'] !== 'undefined' && $data['result'] !== false){
                    append = ' Error: ' + $data['result'];
                }
                appUICommon.showAlert(
                    'Error while getting the result',
                    'API returned a ' + $code + ' code. ' + 'Please try to reload the page.' + append
                );
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
                setTimeout(function () {
                    showLoaderFunction();
                }, 150);
            };

            this.hideLoader = function () {
                setTimeout(function () {
                    hideLoaderFunction();
                }, 150);
            };

            this.checkLoggedIn = function ($callback) {
                if ($rootScope.loggedInChecked !== true) {

                    var loginCallBack = function ($data) {
                        if (typeof $data === 'undefined' || typeof $data['result'] === 'undefined' || $data['result'] === false) {
                            redirectToLogin();
                        }else{
                            $rootScope.loggedInChecked = true;
                            hideLoaderFunction();
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

                    showLoaderFunction();
                    this.isLoggedIn(afterLoginCheck);
                }else{
                    $callback();
                }
            };

            this.isLoggedIn = function ($callback) {
                this.getURL(appConfig.endpoints['isLoggedIn'], $callback);
            };
        });
})();
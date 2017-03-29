(function () {
    'use strict';

    angular.module('app.core')
        .service('appUICommon', ['$mdDialog', '$mdToast', appUICommon])
        .service('appCommon', ['$http', '$rootScope', 'appConfig', 'appUICommon', '$window', '$cookies', '$q', appCommon]);

    function appUICommon($mdDialog, $mdToast) {
        this.showAlert = function ($title, $description) {
            $mdDialog.show(
                $mdDialog.alert()
                    .parent(angular.element(document.querySelector('#popupContainer')))
                    .clickOutsideToClose(true)
                    .title($title)
                    .content($description)
                    .ok('Got it!')
            );
        };

        this.showToast = function ($message) {
            $mdToast.show(
                $mdToast.simple()
                    .content($message)
                    .hideDelay(3000)
                    .position('right top')
            );
        };
    }

    function appCommon($http, $rootScope, appConfig, appUICommon, $window, $cookies, $q) {
        $rootScope.loggedInChecked = false;

        var self = this;

        self.getURL = function ($url, $appendAccessToken, $handleError) {
            if ($appendAccessToken !== false && $cookies.get('access_token') !== null) {
                $url = self.appendURLParameter($url, 'access_token', $cookies.get('access_token'))
            }

            var deferred = $q.defer();
            var request = $http.get($url);

            request.then(function successCallback(response) {
                deferred.resolve(response);
            }, function errorCallback(response, status) {
                if ($handleError !== false) {
                    handleURLError(response, status);
                }
                deferred.reject(response);
            });

            return deferred.promise;
        };

        self.postURL = function ($url, $data, $appendAccessToken, $handleError) {
            if ($appendAccessToken !== false && $cookies.get('access_token') !== null) {
                $url = self.appendURLParameter($url, 'access_token', $cookies.get('access_token'))
            }

            var requestArgs = {
                url: $url,
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                data: $data
            };

            var deferred = $q.defer();
            var request = $http(requestArgs);

            request.then(function successCallback(response) {
                deferred.resolve(response);
            }, function errorCallback(response, status) {
                if ($handleError !== false) {
                    handleURLError(response, status);
                }

                deferred.reject(response, status);
            });

            return deferred.promise;
        };

        this.getUrlParameter = function (parameter) {
            var queryDict = {};
            location.search.substr(1).split("&").forEach(function (item) {
                queryDict[item.split("=")[0]] = item.split("=")[1]
            });

            return queryDict[parameter];
        };

        this.storeCookie = function (key, value, minutes) {
            storeCookieFunction(key, value, minutes);
        };

        var storeCookieFunction = function (key, value, minutes) {
            var dt = new Date();
            dt.setMinutes(dt.getMinutes() + minutes);

            $cookies.put(key, value, {
                expires: dt
            });
        };

        self.requestToken = function ($callback, $type, $code) {
            var data = {
                client_id: appConfig.environment.clientID,
                grant_type: $type,
                redirect_uri: window.location.href
            };

            if ($type !== 'refresh_token') {
                data['code'] = $code;
            } else {
                data['refresh_token'] = $code;
            }

            this.postURL(appConfig.endpoints.retrieveToken, data).then(function (response) {
                $callback(response);
            });
        };

        this.appendURLParameter = function insertParam(url, parameterName, parameterValue, atStart) {
            var replaceDuplicates = true;
            var urlhash;

            if (url.indexOf('#') > 0) {
                var cl = url.indexOf('#');
                urlhash = url.substring(url.indexOf('#'), url.length);
            } else {
                urlhash = '';
                cl = url.length;
            }
            var sourceUrl = url.substring(0, cl);

            var urlParts = sourceUrl.split("?");
            var newQueryString = "";

            if (urlParts.length > 1) {
                var parameters = urlParts[1].split("&");
                for (var i = 0; (i < parameters.length); i++) {
                    var parameterParts = parameters[i].split("=");
                    if (!(replaceDuplicates && parameterParts[0] === parameterName)) {
                        if (newQueryString === "") {
                            newQueryString = "?";
                        } else {
                            newQueryString += "&";
                        }
                        newQueryString += parameterParts[0] + "=" + (parameterParts[1] ? parameterParts[1] : '');
                    }
                }
            }
            if (newQueryString === "") {
                newQueryString = "?";
            }

            if (atStart) {
                newQueryString = '?' + parameterName + "=" + parameterValue + (newQueryString.length > 1 ? '&' + newQueryString.substring(1) : '');
            } else {
                if (newQueryString !== "" && newQueryString !== '?') {
                    newQueryString += "&";
                }
                newQueryString += parameterName + "=" + (parameterValue ? parameterValue : '');
            }
            return urlParts[0] + newQueryString + urlhash;
        };

        var handleURLError = function ($data, $code) {
            var append = '';
            if (typeof $data !== 'undefined' && typeof $data['result'] !== 'undefined' && $data['result'] !== false) {
                append = ' Error: ' + $data['result'];
            }
            appUICommon.showAlert(
                'Error while getting the result',
                'API returned a ' + $code + ' code. ' + 'Please try to reload the page.' + append
            );
            console.log($data);
            console.log($code);
        };

        this.handleURLErrorFunction = handleURLError;

        var redirectToLogin = function () {
            $window.location.href = appConfig.urls['login'];
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
            var onSuccess = function () {
                $rootScope.loggedInChecked = true;
                self.hideLoader();
                $callback();

                return true;
            };

            if ($rootScope.loggedInChecked !== true || $cookies.get('access_token') === null) {

                var loginCallBack = function ($data) {
                    if (typeof $data === 'undefined' || typeof $data['result'] === 'undefined' || $data['result'] === false) {
                        redirectToLogin();
                        return false;
                    } else {
                        var afterTokenCheck = function ($data) {
                            if (typeof $data === 'undefined' || typeof $data['result'] === 'undefined' || $data['result'] === false) {

                                var refreshToken = $cookies.get('refresh_token');
                                var accessToken = $cookies.get('access_token');

                                if (accessToken === null && refreshToken !== null) {
                                    var requestTokenFallback = function ($data) {
                                        if (typeof $data === 'undefined' || typeof $data['access_token'] === 'undefined') {
                                            redirectToLogin();
                                            return false;
                                        } else {
                                            storeCookieFunction('access_token', $data['access_token'], $data['expires_in'] / 60);
                                            storeCookieFunction('refresh_token', $data['refresh_token'], 60 * 24 * 100);
                                            return onSuccess();
                                        }
                                    };

                                    self.requestToken(requestTokenFallback, 'refresh_token', refreshToken);
                                } else if ($cookies.get('refresh_token') === null) {
                                    redirectToLogin();
                                    return false;
                                }
                            } else {
                                return onSuccess();
                            }
                        };
                        self.getURL(appConfig.endpoints.validOAuth).then(function (response) {
                            afterTokenCheck(response);
                        });
                    }
                };

                self.showLoader();
                this.isLoggedIn(loginCallBack);
            } else {
                $callback();
            }
        };

        this.isLoggedIn = function ($callback) {
            this.getURL(appConfig.endpoints['isLoggedIn']).then(function (data) {
                $callback(data);
            });
        };
    }
})();
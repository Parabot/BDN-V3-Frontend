(function () {
    'use strict';

    angular.module('app.users')
        .controller('LoginCtrl', ['$scope', '$window', '$location', 'appConfig', 'appCommon', LoginCtrl])
        .controller('AuthCtrl', ['$scope', '$window', '$location', 'appConfig', 'appCommon', 'appUICommon', AuthCtrl]);

    function AuthCtrl($scope, $window, $location, $appConfig, $appCommon, $appUICommon) {
        $appCommon.showLoader();

        var code = $appCommon.getUrlParameter('code');

        if (code == null) {
            window.location.href = '/';
        } else {

            var afterPost = function ($data, $code) {
                if (typeof $data === 'undefined' || typeof $data['access_token'] === 'undefined') {
                    $appUICommon.showAlert(
                        'Error while getting the result',
                        'API returned an error, please retry logging in again'
                    );
                    console.log($data);
                } else {
                    $appCommon.storeCookie('access_token', $data['access_token'], $data['expires_in'] / 60);
                    $appCommon.storeCookie('refresh_token', $data['refresh_token'], 60 * 24 * 100);
                    window.location.href = '/';
                }
            };

            $appCommon.requestToken(afterPost, 'authorization_code', code);
        }
    }

    function LoginCtrl($scope, $window, $location, $appConfig, $appCommon) {
        $scope.signinText = 'Loading...';
        $scope.signinLoading = true;

        var afterLoggedIn = function ($data) {

            if (typeof $data === 'undefined' || typeof $data['result'] === 'undefined' || $data['result'] === false) {
                $scope.signinText = 'Sign into Parabot';
                $scope.signinLoading = false;
                $scope.signinType = 'primary';
                $scope.loggedin = false;
            } else {
                var afterValidCheck = function ($data) {
                    if (typeof $data === 'undefined' || typeof $data['result'] === 'undefined' || $data['result'] === false) {
                        $scope.signinText = 'Login with your account';
                        $scope.signinLoading = false;
                        $scope.signinType = 'accent';
                        $scope.givenAccess = false;
                    } else {
                        $location.url('/');
                    }
                };
                $appCommon.getURL($appConfig.endpoints.validOAuth, afterValidCheck);
            }
        };

        $appCommon.isLoggedIn(afterLoggedIn);

        $scope.signup = function () {
            $window.location.href = $appConfig.urls.register;
        };

        $scope.signin = function () {
            if ($scope.loggedin === false) {
                window.location.href = $appConfig.urls.log_in + '?after_login_redirect=' + encodeURIComponent(window.location.href);
            } else if ($scope.loggedin !== false && $scope.givenAccess === false) {
                window.location.href = $appConfig.urls.oauth + '?response_type=code&client_id=' + $appConfig.environment.clientID + '&redirect_uri=' + window.location.protocol + '//' + window.location.host;
            }
        }
    }

})();




(function () {
    'use strict';

    angular.module('app.users')
        .controller('LoginCtrl', ['$scope', '$window', '$location', 'appConfig', 'appCommon', LoginCtrl])
        .controller('AuthCtrl', ['$scope', '$window', '$location', 'appConfig', 'appCommon', 'appUICommon', AuthCtrl])
        .controller('UsersCtrl', ['$scope', '$location', 'appConfig', 'appCommon', 'userManager', UsersCtrl])
        .controller('UserCtrl', ['$scope', '$stateParams', 'appConfig', 'appCommon', 'userManager', UserCtrl])
        .controller('ProfileCtrl', ['$scope', '$stateParams', 'appConfig', 'appCommon', 'appUICommon', '$window', ProfileCtrl]);

    function ProfileCtrl($scope, $stateParams, $appConfig, $appCommon, $appUICommon, $window) {
        $scope.isInSlack = null;
        var afterLogin = function () {
            var isInSlack = function ($data) {

                if (typeof $data !== 'undefined' && typeof $data['result'] !== 'undefined') {
                    $scope.isInSlack = $data['result'];
                } else {
                    $appUICommon.showAlert('Incorrect API response', 'API returned something unexpected.')
                }

                $appCommon.hideLoader();
            };
            $appCommon.getURL($appConfig.endpoints.isInSlack).then(function (response) {
                isInSlack(response);
            });
        };

        $scope.slackInvite = function () {
            $scope.waiting = true;

            var submitted = $scope.server;

            var afterRequest = function ($data, $code) {
                $scope.waiting = false;

                if ($data['result'] === true) {
                    $appUICommon.showToast('Invite sent to your email');
                }
            };

            $appCommon.postURL($appConfig.endpoints.inviteSlack, JSON.stringify(submitted), true, false).then(function (response) {
                afterRequest(response);
            }, function errorCallback(response) {
                if (response.code === 500 && response.result === 'already_invited') {
                    $appUICommon.showToast('Invite already sent, please check your email');
                }
            });
        };

        $scope.goToSlack = function () {
            $window.location.href = $appConfig.urls.slack;
        };

        // This route requires authentication
        $appCommon.checkLoggedIn(afterLogin);
    }

    function UserCtrl($scope, $stateParams, $appConfig, $appCommon, userManager) {
        $scope.backURL = $appConfig.urls['users'];

        var afterLogin = function () {
            userManager.getUser($stateParams['id']).then(function (user) {
                $scope.user = user;
            });
        };

        // This route requires authentication
        $appCommon.checkLoggedIn(afterLogin);
    }

    function UsersCtrl($scope, $location, $appConfig, $appCommon, userManager) {
        $scope.numPerPage = 25;
        $scope.totalAmount = 0;
        $scope.searchUsername = '';

        var afterLogin = function () {
            $scope.select(1);
        };

        $scope.select = function (page) {
            $appCommon.showLoader();

            userManager.loadUsers(page).then(function (users) {
                $scope.users = users;
                userManager.getTotalForLatestRetrieval().then(function (total) {
                    $scope.totalAmount = total;
                    $appCommon.hideLoader();
                });
            });
        };

        $scope.openUser = function (id) {
            $location.url($appConfig.routeUrls['user'] + id);
        };

        $scope.search = function () {
            if ($scope.searchUsername.length >= 3) {
                $appCommon.showLoader();

                userManager.loadUsers(1, 'username', $scope.searchUsername).then(function (users) {
                    $scope.users = users;
                    userManager.getTotalForLatestRetrieval().then(function (total) {
                        $scope.totalAmount = total;
                        $appCommon.hideLoader();
                    });
                });
            } else if ($scope.searchUsername.length === 0) {
                $scope.select(1);
            }
        };

        // This route requires authentication
        $appCommon.checkLoggedIn(afterLogin);
    }

    function AuthCtrl($scope, $window, $location, $appConfig, $appCommon, $appUICommon) {
        $appCommon.showLoader();

        var code = $appCommon.getUrlParameter('code');

        if (code === null) {
            $location.url('/');
        } else {
            var afterPost = function ($data, $code) {
                if (typeof $data === 'undefined' || typeof $data['access_token'] === 'undefined') {
                    $appUICommon.showAlert(
                        'Error while getting the result',
                        'API returned an error, please retry logging in again'
                    );
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
                $appCommon.getURL($appConfig.endpoints.validOAuth).then(function (response) {
                    afterValidCheck(response);
                });
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




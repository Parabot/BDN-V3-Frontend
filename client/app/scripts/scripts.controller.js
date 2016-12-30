(function () {
    'use strict';

    angular.module('app.scripts')
        .controller('ScriptsCtrl', ['$scope', 'appConfig', 'appCommon', 'appUICommon', ScriptsCtrl])
        .controller('ScriptCtrl', ['$scope', '$stateParams', 'appConfig', 'appCommon', 'appUICommon', 'userManager', ScriptCtrl])
        .controller('BuildsCtrl', ['$scope', '$stateParams', 'appConfig', 'appCommon', 'appUICommon', BuildsCtrl])
        .controller('BuildCtrl', ['$scope', '$stateParams', 'appConfig', 'appCommon', 'appUICommon', BuildCtrl]);

    function BuildCtrl($scope, $stateParams, $appConfig, $appCommon, $appUICommon) {
        $scope.buildID = $stateParams['id'];

        $scope.goBack = function () {
            window.history.back();
        };

        var afterLogin = function () {
            $appCommon.showLoader();

            var buildCallback = function ($data) {
                if (typeof $data !== 'undefined' && typeof $data['build'] !== 'undefined') {
                    console.log($data);
                    $scope.build = $data['build'];
                    $scope.log = $data['log'];
                } else {
                    $appUICommon.showAlert('Incorrect API response', 'API returned something unexpected.')
                }
                $appCommon.hideLoader();
            };

            $appCommon.getURL($appConfig.endpoints['build'] + $stateParams['id'], buildCallback);
        };

        // This route requires authentication
        $appCommon.checkLoggedIn(afterLogin);
    }

    function BuildsCtrl($scope, $stateParams, $appConfig, $appCommon, $appUICommon) {
        $scope.buildURL = $appConfig.urls['build'];
        $scope.scriptID = $stateParams['id'];

        $scope.build = function () {
            $appCommon.showLoader();
            var buildCreateCallback = function ($data) {
                if (typeof $data !== 'undefined' && typeof $data['result'] !== 'undefined' && $data['result'] == true) {
                    $appUICommon.showToast('Build started, this might take up to a few minutes.');
                } else {
                    $appUICommon.showAlert('Incorrect API response', 'API returned something unexpected.')
                }
                $appCommon.hideLoader();
            };

            $appCommon.postURL($appConfig.endpoints['createBuild'] + $stateParams['id'], buildCreateCallback);
        };

        var afterLogin = function () {
            $appCommon.showLoader();

            var buildsListCallback = function ($data) {
                if (typeof $data !== 'undefined' && typeof $data['builds'] !== 'undefined') {

                    $scope.builds = $data['builds'];
                    $scope.script = $data['script'];
                } else {
                    $appUICommon.showAlert('Incorrect API response', 'API returned something unexpected.')
                }
                $appCommon.hideLoader();
            };

            $appCommon.getURL($appConfig.endpoints['buildsList'] + $stateParams['id'], buildsListCallback);
        };

        // This route requires authentication
        $appCommon.checkLoggedIn(afterLogin);
    }

    function ScriptCtrl($scope, $stateParams, $appConfig, $appCommon, $appUICommon, userManager) {
        $scope.backURL = $appConfig.urls['scripts'];
        if ($stateParams['id'] !== undefined) {
            console.log($stateParams['id']);
            $scope.buildsURL = $appConfig.urls['builds'] + $stateParams['id'];
        }

        var afterLogin = function () {
            $appCommon.showLoader();

            var categoriesListCallback = function ($data) {
                if (typeof $data !== 'undefined' && typeof $data['categories'] !== 'undefined') {
                    $scope.possibleCategories = $data['categories'];
                } else {
                    $appUICommon.showAlert('Incorrect API response', 'API returned something unexpected.')
                }
                $appCommon.hideLoader();
            };

            var scriptGroupListCallback = function ($data) {
                if (typeof $data !== 'undefined' && typeof $data['groups'] !== 'undefined') {
                    $scope.possibleGroups = $data['groups'];
                } else {
                    $appUICommon.showAlert('Incorrect API response', 'API returned something unexpected.')
                }
                $appCommon.hideLoader();

                $appCommon.showLoader();
                $appCommon.getURL($appConfig.endpoints['categoriesList'], categoriesListCallback);
            };

            var scriptsListCallback = function ($data) {
                if (typeof $data !== 'undefined' && typeof $data['result'] !== 'undefined') {
                    $scope.script = $data['result'];
                } else {
                    $appUICommon.showAlert('Incorrect API response', 'API returned something unexpected.')
                }
                $appCommon.hideLoader();

                $appCommon.showLoader();
                $appCommon.getURL($appConfig.endpoints['groupsList'], scriptGroupListCallback);
            };

            if ($stateParams['id'] !== undefined) {
                $appCommon.getURL($appConfig.endpoints['scriptGet'] + $stateParams['id'], scriptsListCallback);
            } else {
                $appCommon.getURL($appConfig.endpoints['groupsList'], scriptGroupListCallback);

                $scope.script = {};
                userManager.getMyUser().then(function ($user) {
                    $scope.script.authors = [
                        {
                            username: $user['username']
                        }
                    ];

                    $scope.script.creator = {
                        username: $user['username']
                    };
                });
            }
        };

        $scope.gitCheck = function () {
            var valid = /((git)|(git@[\w\.]+))(:(\/\/)?)([\w\.@\:\/\-~]+)(\.git)(\/)?/.test($scope.script.git.url);
            if (!valid) {
                $appUICommon.showToast('Please insert a valid git URL (like git@domain.com:username/project.git)');
            }
        };

        $scope.removeAuthor = function ($username) {
            if ($username == $scope.script.creator.username) {
                $appUICommon.showToast('You cannot remove the creator of the script');
            } else {
                $scope.script.authors = $scope.script.authors.filter(function (el) {
                    return el.username !== $username;
                });
            }
        };

        $scope.removeGroup = function ($id) {
            $scope.script.groups = $scope.script.groups.filter(function (el) {
                return el.id !== $id;
            });
        };

        $scope.removeCategory = function ($id) {
            $scope.script.categories = $scope.script.categories.filter(function (el) {
                return el.id !== $id;
            });
        };

        $scope.processCreateForm = function () {
            $scope.waiting = true;

            var submitted = $scope.script;

            var afterRequest = function ($data, $code) {
                $scope.waiting = false;

                $appUICommon.showToast($data['result']);
            };

            $appCommon.postURL($appConfig.endpoints['scriptCreate'], afterRequest, JSON.stringify(submitted), true, afterRequest);
        };

        $scope.processForm = function () {
            $scope.waiting = true;

            var submitted = $scope.script;

            var afterRequest = function ($data, $code) {
                $scope.waiting = false;

                $appUICommon.showToast($data['result']);
            };

            $appCommon.postURL($appConfig.endpoints['scriptUpdate'], afterRequest, JSON.stringify(submitted));
        };

        $scope.addAuthor = function () {
            if ($scope.script.authors !== undefined) {
                $scope.script.authors.push({});
            }
        };

        $scope.addGroup = function () {
            if ($scope.script.groups === undefined) {
                $scope.script.groups = [];
            }
            $scope.script.groups.push({});
        };

        $scope.addCategory = function () {
            if ($scope.script.categories === undefined) {
                $scope.script.categories = [];
            }
            $scope.script.categories.push({});
        };

        // This route requires authentication
        $appCommon.checkLoggedIn(afterLogin);
    }

    function ScriptsCtrl($scope, $appConfig, $appCommon, $appUICommon) {
        $scope.scriptURL = $appConfig.urls['script'];

        var afterLogin = function () {
            $appCommon.showLoader();

            var scriptsListCallback = function ($data) {
                if (typeof $data !== 'undefined' && typeof $data['scripts'] !== 'undefined') {
                    $scope.scripts = $data['scripts'];
                } else {
                    $appUICommon.showAlert('Incorrect API response', 'API returned something unexpected.')
                }
                $appCommon.hideLoader();
            };

            $appCommon.getURL($appConfig.endpoints['myScriptsList'], scriptsListCallback);
        };

        // This route requires authentication
        $appCommon.checkLoggedIn(afterLogin);
    }

})();
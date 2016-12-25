(function () {
    'use strict';

    angular.module('app.scripts')
        .controller('ScriptsCtrl', ['$scope', 'appConfig', 'appCommon', 'appUICommon', ScriptsCtrl])
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
                }else{
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
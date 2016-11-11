(function () {
    'use strict';

    angular.module('app.servers')
        .controller('ServersCtrl', ['$scope', 'appConfig', 'appCommon', 'Server', ServersCtrl])
        .controller('ServerCtrl', ['$scope', '$stateParams', 'appConfig', 'appCommon', 'appUICommon', ServerCtrl])
        .controller('HookCtrl', ['$scope', '$stateParams', 'appConfig', 'appCommon', 'appUICommon', '$uibModal', HookCtrl]);

    function HookCtrl($scope, $stateParams, $appConfig, $appCommon, $appUICommon, $uibModal) {
        $scope.backURL = $appConfig.urls['servers'];

        var afterLogin = function () {
            $appCommon.showLoader();

            $scope.items = ["Item 1", "Item 2", "Item 3"];
            $scope.addHooksRow = function () {

                var modalInstance = $uibModal.open({
                    animation: $scope.animationsEnabled,
                    templateUrl: 'myModalContent.html',
                    controller: 'ModalInstanceCtrl',
                    size: 'lg',
                    resolve: {
                        items: function () {
                            return $scope.items;
                        }
                    }
                });

                modalInstance.result.then(function (selectedItem) {
                    $scope.selected = selectedItem;
                }, function () {
                    $log.info('Modal dismissed at: ' + new Date());
                });
            };

            var hooksListCallback = function ($data) {
                if (typeof $data !== 'undefined' && typeof $data['hooks'] !== 'undefined') {

                    $scope.hooks = $data['hooks'];
                } else {
                    $appUICommon.showAlert('Incorrect API response', 'API returned something unexpected.')
                }

                $appCommon.hideLoader();
            };
            $appCommon.getURL($appConfig.endpoints['hooksDetailed'] + $stateParams['id'] + '?detailed=true', hooksListCallback);
        };

        // This route requires authentication
        $appCommon.checkLoggedIn(afterLogin);
    }

    function ServersCtrl($scope, $appConfig, $appCommon, Server) {
        $scope.serverURL = $appConfig.urls['server'];

        var afterLogin = function () {
            $appCommon.showLoader();

            var serversListCallback = function ($data) {
                $scope.servers = [];
                $data.forEach(function (object) {
                    $scope.servers.push(Server.build(object));
                });

                $appCommon.hideLoader();
            };
            $appCommon.getURL($appConfig.endpoints['serversList'], serversListCallback);
        };

        // This route requires authentication
        $appCommon.checkLoggedIn(afterLogin);
    }

    function ServerCtrl($scope, $stateParams, $appConfig, $appCommon, $appUICommon) {
        $scope.backURL = $appConfig.urls['servers'];
        $scope.waiting = true;

        var afterLogin = function () {
            $appCommon.showLoader();

            var serverCallback = function ($data) {
                $scope.server = $data['result'];
                $scope.waiting = false;

                $appCommon.hideLoader();
            };

            $appCommon.getURL($appConfig.endpoints['serverGet'] + $stateParams['id'], serverCallback);
        };

        $scope.processForm = function () {
            $scope.waiting = true;

            var submitted = $scope.server;

            var afterRequest = function ($data, $code) {
                $scope.waiting = false;

                $appUICommon.showToast($data['result']);
            };

            $appCommon.postURL($appConfig.endpoints['serverUpdate'], afterRequest, JSON.stringify(submitted));
        };

        $scope.addDetailsRow = function () {
            $scope.server.details.push({});
        };

        $scope.removeDetailsRow = function ($name) {
            $scope.server.details = $scope.server.details.filter(function (el) {
                return el.name !== $name;
            });
        };

        // This route requires authentication
        $appCommon.checkLoggedIn(afterLogin);
    }

})(); 
(function () {
    'use strict';

    angular.module('app.servers')
        .controller('ServersCtrl', ['$scope', 'appConfig', 'appCommon', 'Server', ServersCtrl])
        .controller('ServerCtrl', ['$scope', '$stateParams', 'appConfig', 'appCommon', 'appUICommon', 'userManager', '$state', '$location', ServerCtrl])
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
            $appCommon.getURL($appConfig.endpoints['hooksDetailed'] + $stateParams['id'] + '?detailed=true').then(function(response){
                hooksListCallback(response);
            });
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
            $appCommon.getURL($appConfig.endpoints['serversList']).then(function(response){
                serversListCallback(response);
            });
        };

        // This route requires authentication
        $appCommon.checkLoggedIn(afterLogin);
    }

    function ServerCtrl($scope, $stateParams, $appConfig, $appCommon, $appUICommon, userManager, $state, $location) {
        $scope.backURL = $appConfig.urls['servers'];
        $scope.waiting = true;

        var afterLogin = function () {
            $appCommon.showLoader();

            var serverGroupListCallback = function ($data) {
                if (typeof $data !== 'undefined' && typeof $data['groups'] !== 'undefined') {
                    $scope.possibleGroups = $data['groups'];
                } else {
                    $appUICommon.showAlert('Incorrect API response', 'API returned something unexpected.')
                }
                $appCommon.hideLoader();
            };

            var serverCallback = function ($data) {
                $scope.server = $data['result'];

                $scope.waiting = false;
                $appCommon.hideLoader();

                $appCommon.showLoader();
                $appCommon.getURL($appConfig.endpoints['groupsList']).then(function(response){
                    serverGroupListCallback(response);
                });
            };

            if ($stateParams['id'] !== undefined) {
                $appCommon.getURL($appConfig.endpoints['serverGet'] + $stateParams['id']).then(function(response){
                    serverCallback(response);
                });
            } else {
                $appCommon.getURL($appConfig.endpoints['groupsList']).then(function(response){
                    serverGroupListCallback(response);
                });

                $scope.server = {};
                $scope.server.details = [
                    {
                        name: 'live_client',
                        value: ''
                    },
                    {
                        name: 'client_class',
                        value: ''
                    },
                    {
                        name: 'provider',
                        value: ''
                    }
                ];
                userManager.getMyUser().then(function ($user) {
                    $scope.server.authors = [
                        {
                            username: $user['username']
                        }
                    ];
                });

                $scope.waiting = false;
                $appCommon.hideLoader();
            }
        };

        $scope.processForm = function () {
            $scope.waiting = true;

            var submitted = $scope.server;

            var afterRequest = function ($data, $code) {
                $scope.waiting = false;

                $appUICommon.showToast($data['result']);
            };

            $appCommon.postURL($appConfig.endpoints['serverUpdate'], JSON.stringify(submitted)).then(function(response){
                afterRequest(response);
            });
        };

        $scope.processCreateForm = function () {
            $scope.waiting = true;

            var submitted = $scope.server;

            var afterRequest = function ($data, $code) {
                $scope.waiting = false;

                $appUICommon.showToast($data['result']);

                setTimeout(function(){
                    $location.url($appConfig.routeUrls.servers);
                }, 250);
            };

            $appCommon.postURL($appConfig.endpoints['serverCreate'], JSON.stringify(submitted), true).then(function(response){
                afterRequest(response, 200);
            }).catch(function(response, code){
                afterRequest(response, code);
            });
        };

        $scope.addAuthor = function () {
            if ($scope.server.authors !== undefined) {
                $scope.server.authors.push({});
            }
        };

        $scope.removeAuthor = function ($username) {
            $scope.server.authors = $scope.server.authors.filter(function (el) {
                return el.username !== $username;
            });
        };

        $scope.addGroup = function () {
            if ($scope.server.groups === undefined) {
                $scope.server.groups = [];
            }
            $scope.server.groups.push({});
        };

        $scope.removeGroup = function ($id) {
            $scope.server.groups = $scope.server.groups.filter(function (el) {
                return el.id !== $id;
            });
        };

        $scope.addDetailsRow = function () {
            if ($scope.server.details === undefined) {
                $scope.server.details = [];
            }

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
(function () {
    'use strict';

    angular.module('app.servers')
        .controller('ServersCtrl', ['$scope', 'appConfig', 'appCommon', 'Server', ServersCtrl])
        .controller('ServerCtrl', ['$scope', '$stateParams', '$http', 'appConfig', 'appCommon', ServerCtrl]);

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

    function ServerCtrl($scope, $stateParams, $http, $appConfig, $appCommon) {
        $scope.backURL = $appConfig.urls['servers'];

        var afterLogin = function(){
            var serverCallback = function ($data) {
                $scope.server = $data['result'];
            };

            $scope.processForm = function () {
                var submitted = $scope.server;
                delete submitted['id'];

                $scope.submitted = submitted;
            };

            $appCommon.getURL($appConfig.endpoints['serverGet'] + $stateParams['id'], serverCallback);
        };

        // This route requires authentication
        $appCommon.checkLoggedIn(afterLogin);
    }

})(); 
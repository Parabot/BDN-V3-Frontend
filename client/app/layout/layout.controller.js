(function () {
    'use strict';

    angular.module('app.layout')
        .controller('SidebarManager', ['$scope', '$rootScope', 'appConfig', 'userManager', SidebarManager]);

    function SidebarManager($scope, $rootScope, $appConfig, userManager) {
        userManager.getMyUser().then(function (user) {
            $rootScope.user = user;
            console.log(user);
        });

        $scope.isAdmin = function () {
            if ($rootScope.user !== undefined) {
                if ($rootScope.user.isAdmin === true) {
                    return true;
                }

                $rootScope.user.groups.forEach(function (group) {
                    $appConfig.groups.administrators.forEach(function (groupId) {
                        if (group.communityId == groupId) {
                            $rootScope.user.isAdmin = true;
                            return true;
                        }
                    })
                });
            }

            return false;
        };

        $scope.isScriptWriter = function () {
            if ($rootScope.user !== undefined) {
                if ($rootScope.user.isScriptWriter === true) {
                    return true;
                }

                $rootScope.user.groups.forEach(function (group) {
                    $appConfig.groups.scriptWriters.forEach(function (groupId) {
                        if (group.communityId == groupId) {
                            $rootScope.user.isScriptWriter = true;
                            return true;
                        }
                    })
                });
            }

            return false;
        };

        $scope.isServerDeveloper = function () {
            if ($rootScope.user !== undefined) {
                if ($rootScope.user.isServerDeveloper === true) {
                    return true;
                }

                $rootScope.user.groups.forEach(function (group) {
                    $appConfig.groups.serverDevelopers.forEach(function (groupId) {
                        if (group.communityId == groupId) {
                            $rootScope.user.isServerDeveloper = true;
                            return true;
                        }
                    })
                });
            }

            return false;
        };
    }
})();
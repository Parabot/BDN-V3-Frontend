(function () {
    'use strict';

    angular.module('app')
        .controller('DashboardCtrl', ['$scope', 'appCommon', 'appConfig', DashboardCtrl]);

    function DashboardCtrl($scope, $appCommon, $appConfig) {
        $scope.profileLink = $appConfig.urls.user_profile;

        var afterLogin = function () {
        };
        $appCommon.checkLoggedIn(afterLogin);
    }

})(); 

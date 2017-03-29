(function () {
    'use strict';

    angular.module('app')
        .controller('DashboardCtrl', ['$scope', 'appCommon', DashboardCtrl]);

    function DashboardCtrl($scope, $appCommon) {

        var afterLogin = function() {};
        $appCommon.checkLoggedIn(afterLogin);
    }

})(); 

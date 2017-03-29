(function () {
    'use strict';

    angular.module('app.core', [
        // Angular modules
        'ngAnimate'
        , 'ngAria'
        , 'ngMessages'
        , 'ngCookies'

        // Custom modules
        , 'app.layout'

        // 3rd Party Modules
        ,'oc.lazyLoad'
        , 'ngMaterial'
        , 'ui.router'
        , 'duScroll'
    ]).config(['$httpProvider', function ($httpProvider) {
        $httpProvider.defaults.withCredentials = true;
    }]);

})();
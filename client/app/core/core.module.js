(function () {
    'use strict';

    angular.module('app.core', [
        // Angular modules
        'ngAnimate'
        , 'ngAria'
        , 'ngMessages'

        // Custom modules
        , 'app.layout'
        , 'app.i18n'

        // 3rd Party Modules
        , 'ngMaterial'
        , 'ui.router'
        , 'ui.bootstrap'
        , 'duScroll'
    ]).config(['$httpProvider', function ($httpProvider) {
        $httpProvider.defaults.withCredentials = true;
    }]);

})();
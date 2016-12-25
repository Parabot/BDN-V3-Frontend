(function () {
    'use strict';

    angular.module('app')
        .config(['$stateProvider', '$urlRouterProvider', '$locationProvider', function ($stateProvider, $urlRouterProvider, $locationProvider) {
                var routes, setRoutes;

                routes = [
                    'users/list',
                    'users/get/:id',
                    'users/login',
                    'users/auth',

                    'servers/list',
                    'servers/get/:id',
                    'servers/hooks/:id',

                    'scripts/list',
                    'scripts/get/:id',
                    'scripts/builds/:id',
                    'scripts/build/:id',

                    'ui/cards', 'ui/typography', 'ui/buttons', 'ui/icons', 'ui/grids', 'ui/widgets', 'ui/components', 'ui/timeline', 'ui/lists', 'ui/pricing-tables',
                    'map/maps',
                    'table/static', 'table/dynamic', 'table/responsive',
                    'form/elements', 'form/layouts', 'form/validation', 'form/wizard',
                    'chart/echarts', 'chart/echarts-line', 'chart/echarts-bar', 'chart/echarts-pie', 'chart/echarts-scatter', 'chart/echarts-more',
                    'page/404', 'page/500', 'page/blank', 'page/forgot-password', 'page/invoice', 'page/lock-screen', 'page/profile', 'page/signin', 'page/signup',
                    'app/calendar'
                ];

                setRoutes = function (route) {
                    var config, url;
                    url = '/' + route;
                    config = {
                        url: url,
                        templateUrl: 'app/' + route.replace(/\/:.*/g, '') + '.html'
                    };
                    $stateProvider.state(route, config);
                    return $stateProvider;
                };

                routes.forEach(function (route) {
                    return setRoutes(route);
                });

                // Check if we have an oauth code
                var field = 'code';
                var url = window.location.href;
                if (url.indexOf('?' + field + '=') != -1 || url.indexOf('&' + field + '=') != -1) {
                    $urlRouterProvider
                        .when('/', '/users/auth')
                        .otherwise('/users/auth');
                } else {
                    $urlRouterProvider
                        .when('/', '/dashboard')
                        .otherwise('/dashboard');
                }


                $stateProvider.state('dashboard', {
                    url: '/dashboard',
                    templateUrl: 'app/dashboard/dashboard.html'
                });

            }]
        );

})(); 
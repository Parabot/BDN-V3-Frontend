const API_ENDPOINT = 'http://local.v3.bdn.parabot.org:88/api';

var websiteModule = angular.module('websiteModule', []);
websiteModule.run(function($rootScope){
    $rootScope.ROUTES = {
        latest_stable_client: API_ENDPOINT + '/bot/list/client?latest=true&stable=true'
    }
});

websiteModule.controller('homeCtrl', function () {

});

var headerModule = angular.module('headerModule', []);
headerModule.controller('headerCtrl',
    function ($scope) {
        $scope.cart_items = [
            {
                name: 'Product 1',
                price: 50,
                image: 'assets/images/img-one.jpg'
            },
            {
                name: 'Product 2',
                price: 20,
                image: 'assets/images/img-two.jpg'
            },
            {
                name: 'Product 3',
                price: 180,
                image: 'assets/images/img-three.jpg'
            }
        ];

        $scope.cart_items_amount = 0;
        for (var key in $scope.cart_items) {
            if ($scope.cart_items.hasOwnProperty(key)) {
                var item = $scope.cart_items[key];
                $scope.cart_items_amount += item.price;
            }
        }
        $scope.cart_items_amount.toFixed(2);

        $scope.remove = function (index) {
            $scope.items.splice(index, 1);
        }
    }
);

var downloadModule = angular.module('downloadModule', ['ngResource']);
downloadModule.factory('Client', function ($resource) {
    return $resource(API_ENDPOINT + '/bot/list/client?nightly=true').query();
});

downloadModule.controller('downloadCtrl',
    function ($scope, Client) {
        if ($scope.clients === undefined || $scope.clients.length <= 0) {
            $scope.clients = Client;
        }

        $scope.downloadUrl = API_ENDPOINT + '/bot/download/client?build=';
    }
);

var websiteApp = angular.module('websiteApp', ['headerModule', 'websiteModule', 'downloadModule', 'ui.router'])
    .config(['$stateProvider', '$urlRouterProvider', '$locationProvider',
        function ($stateProvider, $urlRouterProvider, $locationProvider) {

            $urlRouterProvider.otherwise('/404');

            $stateProvider
                .state('404', {
                    url: '/404',
                    templateUrl: '/views/tpls/404.tpl.html'
                })
                .state('home', {
                    url: '/',
                    templateUrl: '/views/tpls/home.tpl.html'
                })
                .state('downloads', {
                    url: '/downloads',
                    templateUrl: '/views/tpls/downloads.tpl.html',
                    controller: 'downloadCtrl'
                });

            $locationProvider.html5Mode({
                enabled: true
            });
        }
    ])
    .run(['$rootScope', '$state', '$stateParams',
        function ($rootScope, $state, $stateParams) {
            $rootScope.$state = $state;
            $rootScope.$stateParams = $stateParams;
        }
    ])
    .run(['$rootScope', '$state',
        function ($rootScope, $state) {
            $rootScope.$on('$stateChangeStart', function (evt, to, params) {
                if (to.redirectTo) {
                    evt.preventDefault();
                    $state.go(to.redirectTo, params)
                }
            });
        }
    ]);
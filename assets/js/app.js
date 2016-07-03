var websiteModule = angular.module('websiteModule', []);
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

var websiteApp = angular.module('websiteApp', ['headerModule', 'websiteModule']);
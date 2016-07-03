var websiteApp = angular.module('websiteApp', []);

websiteApp.controller('homeCtrl', function (){
    
});

websiteApp.controller('lookcontactCtrl', function ($scope, $http) {

    $scope.contactformData = {};
    $scope.submit = false;
    $scope.submitcontactForm = function (data1) {
        $scope.submit = true;
        var name = /^[a-zA-Z]/;

        if (data1 == true) {
            if (!$scope.contactformData) {
                return false;
            }
        } else if (!$scope.contactformData) {
            return false;
        }
        else if ($scope.contactformData.email == undefined) {
            $('#email').addClass('error')
        }
        else if (name.test($scope.contactformData.name) == false || $scope.contactformData.name == undefined) {
            $('#name').addClass('error')
        }
        else {
            $scope.submit = false;
            $http({
                method: 'POST',
                url: 'mail.php',
                data: $.param($scope.contactformData),
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }).success(function (data) {
                if (data) {
                    $scope.contactformData = {};
                    $scope.submit = false;
                    $('input').val('');
                    $('textarea').val('');
                    alert("form submit successfully");
                }
            });
        }
    };
}); 
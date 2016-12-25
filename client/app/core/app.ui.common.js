(function () {
    'use strict';

    angular.module('app.core')
        .service('appUICommon', function ($mdDialog, $mdToast, $window) {
            this.showAlert = function ($title, $description) {
                $mdDialog.show(
                    $mdDialog.alert()
                        .parent(angular.element(document.querySelector('#popupContainer')))
                        .clickOutsideToClose(true)
                        .title($title)
                        .content($description)
                        .ok('Got it!')
                );
            };

            this.showToast = function ($message) {
                $mdToast.show(
                    $mdToast.simple()
                        .content($message)
                        .hideDelay(3000)
                        .position('right top')
                );
            }
        });
})();
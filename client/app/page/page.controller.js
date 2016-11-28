(function () {
    'use strict';

    angular.module('app.page')
        .controller('invoiceCtrl', ['$scope', '$window', invoiceCtrl]);

    function invoiceCtrl($scope, $window) {
        var printContents, originalContents, popupWin;

        $scope.printInvoice = function () {
            printContents = document.getElementById('invoice').innerHTML;
            originalContents = document.body.innerHTML;
            popupWin = window.open();
            popupWin.document.open();
            popupWin.document.write('<html><head><link rel="stylesheet" type="text/css" href="styles/main.css" /></head><body onload="window.print()">' + printContents + '</html>');
            popupWin.document.close();
        }
    }
})(); 




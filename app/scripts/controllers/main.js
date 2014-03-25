'use strict';

var hypeApp = angular.module('hypeApp');

hypeApp.controller('MainCtrl', function ($scope) {

    $scope.Math = window.Math;

    $scope.start = function() {
        $scope.sesh = new HypeSesh({
            scope: $scope,
            frequency: 100,
        });
        $scope.sesh.start();
        return true;
    }

    $scope.stop = function() {
        $scope.sesh.stop();
        return true;
    }
});

hypeApp.filter('maxDecimals', function() {
    return function(n, max) {
        var max = Math.pow(10, max);
        return Math.round(n * max) / max;
    }
});



'use strict';
angular.module('app', [
    'ngResource',
    'ngRoute',
    'eduCKate'
])
.config(['$routeProvider', '$locationProvider', function ($routeProvider) {
    $routeProvider
    .when('/', {
        templateUrl: "/demo.html",
        controller: 'AppCtlr'
    })
    .otherwise({ redirectTo: '/' });
}])
.controller('AppCtlr', function($scope){
    $scope.steps1 = {
        initialize: function(){
            var el = document.getElementById('el1');
            el.textContent = 'THIS IS AN H1!!!';
            console.log('done init');
        },
        onDone: function(){
            console.log('ALL DONE')
        },
        onNext: function(){
            console.log('Doing next')
        },
        onPrevious: function(){
            console.log('Get prev')
        },
        steps: [
            {
                text: "Hi! This an h1.",
                element: '#el1',
                fn: function(){
                    console.log('do 1')
                }
            },
            {
                text: "This another h1.",
                element: '#el2',
                fn: function(){
                    console.log('do 2')
                }
            },
            {
                text: "There a lot of h1's here",
                element: '#el12',
                fn: function(){
                    console.log('do 3')
                }
            }
        ]
    };

    //$scope.educkateSteps = null;

    $scope.setSteps = function(stepsToAdd){
        $scope.educkateSteps = stepsToAdd;
    };
});

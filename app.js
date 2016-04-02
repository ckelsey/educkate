'use strict';
angular.module('app', [
    'ngResource',
    'ngRoute',
    'walKthru'
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
    $scope.firstN = null;
    $scope.lastN = null;
    $scope.sayMyName = function(){
        if($scope.firstN || $scope.lastN){
            $scope.whatsMyName = $scope.firstN +' '+ $scope.lastN;
        }else{
            $scope.whatsMyName = '';
        }
    };

    $scope.walkthruFnOptions = {
        iAmSnoopLion: {
            text: 'Set to Snoop Lion',
            fn:function(){
                $scope.firstN = 'Snoop';
                $scope.lastN = 'Lion';
            }
        },
        iAmSnoopDogg: {
            text: 'Set to Snoop Dogg',
            fn:function(){
                $scope.firstN = 'Snoop';
                $scope.lastN = 'Dogg';
            }
        },
        submitSampleForm: {
            text: 'Submit sample form',
            fn:function(){
                $scope.sayMyName();
            }
        },
        resetSampleForm: {
            text: 'Reset sample form',
            fn:function(){
                $scope.firstN = null;
                $scope.lastN = null;
                $scope.sayMyName();
            }
        },
        alertName: {
            text: 'Alert what\'s my name',
            fn:function(){
                alert($scope.whatsMyName);
            }
        }
    };

    $scope.walkthruInit = 'iAmSnoopLion';
    $scope.walkthruOnDone = 'resetSampleForm';
    $scope.walkthruOnNext = 'submitSampleForm';
    $scope.walkthruOnPrevious = 'submitSampleForm';
    $scope.walkthruSteps = [
        {
            text: "Welcome, let me show you walKthru."
        },
        {
            text: "Using the \"onInitialize\" property, I called iAmSnoopLion(), which set the sample form inputs when this walKthru started.",
            element: '#initialize'
        },
        {
            text: "Using the \"onNext\" and \"onPrevious\" properties, I call submitSampleForm(). These properties are useful if you want something to happen everytime the user goes to another step.",
            element: '.nextNprev'
        },
        {
            text: "The \"onDone\" property is used when the user clicks the orange close button. Here, I'm calling resetSampleForm().",
            element: '.done'
        },
        {
            text: 'There are 3 properties for each step, "text", "element", and "fn"',
            element: '.stepform'
        },
        {
            text: '"text" sets the text content of this box. HTML works too.',
            element: '.stepform:nth-child(7) input'
        },
        {
            text: '"element" sets the element to focus on. This is optional.',
            element: '.stepform:nth-child(8) div:nth-child(2) input'
        },
        {
            text: 'If "element" is not provided, I\'ll just center myself.'
        },
        {
            text: 'If "fn" is set, the provided function will be called. Here I called alertName(), which was where that alert box came from.',
            element: '.stepform:nth-child(10) select',
            fnName: 'alertName'
        },
        {
            text: 'That\'s about it, thanks for checking me out. If you have any problems or suggestions, <a href="https://github.com/ckelsey/walKthru/issues">send me a note</a>'
        }
    ];
    $scope.walkthru = {};
    $scope.startWalKthru = function(){
        for(var i=0; i<$scope.walkthruSteps.length; i++){
            if($scope.walkthruSteps[i].fnName){
                $scope.walkthruSteps[i].fn = $scope.walkthruFnOptions[$scope.walkthruSteps[i].fnName].fn;
            }
        }

        $scope.walkthru = {
            steps: $scope.walkthruSteps,
            onInitialize: ($scope.walkthruInit ? $scope.walkthruFnOptions[$scope.walkthruInit].fn : null),
            onDone: ($scope.walkthruOnDone ? $scope.walkthruFnOptions[$scope.walkthruOnDone].fn : null),
            onPrevious: ($scope.walkthruOnPrevious ? $scope.walkthruFnOptions[$scope.walkthruOnPrevious].fn : null),
            onNext: ($scope.walkthruOnNext ? $scope.walkthruFnOptions[$scope.walkthruOnNext].fn : null),
        };
        console.log($scope.walkthru)
    };
});

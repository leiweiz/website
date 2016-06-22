/**
 * Created by lei on 6/21/16.
 */

var app = angular.module('MyApp', ['ngRoute', 'ngMaterial', 'ngMdIcons'])
    .run(function() {
        console.log('MyApp is ready!');
    });

app.config(function($mdThemingProvider) {
    $mdThemingProvider.theme('default')
        .primaryPalette('brown')
        .accentPalette('red');
});

app.config(['$routeProvider',
    function ($routeProvider) {
        $routeProvider.
            when('/summary', {
                templateUrl: '/client/controllers/weight/summary/summaryTemplate.ejs',
                controller: 'SummaryController'
            }).
            when('/history', {
                templateUrl: '/client/controllers/weight/history/historyTemplate.ejs',
                controller: 'HistoryController'
            }).
            when('/chart', {
                templateUrl: '/client/controllers/weight/chart/chartTemplate.ejs',
                controller: 'ChartController'
            }).
            when('/settings', {
                templateUrl: '/client/controllers/weight/settings/settingsTemplate.ejs',
                controller: 'SettingsController'
            }).
            otherwise({
                redirectTo: '/summary'
            });
    }]);

app.controller('WeightController',
    ['$scope', '$location', function($scope, $location) {

        $scope.selectedOption = 'summary'; // check not null
        $scope.selectOption= selectOption;

        function selectOption(option) {
            console.log('select');
            $scope.selectedOption = option;
            $location.path(option);
        }

    }]);
/**
 * Created by lei on 6/21/16.
 */

var app = angular.module('MyApp', ['ngRoute', 'ngMaterial', 'ngMdIcons', 'md.data.table'])
    .run(function() {
        console.log('MyApp is ready!');
    });

app.config(function($mdThemingProvider) {
    $mdThemingProvider.theme('default')
        .primaryPalette('brown')
        .accentPalette('red');
});

app.service('weightDataService', function() {
    var self = this;

    self.goalWeight = 70;

    self.Constant = {
        'updated': 'weightDataService:update'
    };

    self.weightData = [
        {
            date: new Date('06/11/2016'),
            weight: 70
        },
        {
            date: new Date('06/12/2016'),
            weight: 71
        },
        {
            date: new Date('06/13/2016'),
            weight: 73
        }
    ];
});

app.service('graphService', function() {
    var self = this;

    self.layout = {
        title: 'weight chart',
        xaxis: {
            title: 'date'
        },
        yaxis: {
            title: 'weight',
            range: [60, 90]
        }
    };

    self.draw = function(canvasId, weightData, goalWeight) {

        data = self.parseWeightData(weightData, goalWeight);

        Plotly.newPlot(canvasId, data, self.layout);
    };

    self.parseWeightData = function(weightData, goalWeight) {
        var weight = {
            x: [],
            y: [],
            type: 'scatter',
            name: 'weight'
        };

        var goal = {
            x: [],
            y: [],
            type: 'scatter',
            name: 'goal'
        };

        for (var i = 0; i < weightData.length; i++) {
            var d = weightData[i];
            var xVal = d.date.getDate() + '/' + (d.date.getMonth() + 1);

            weight.x.push(xVal);
            weight.y.push(d.weight);

            goal.x.push(xVal);
            goal.y.push(goalWeight);
        }

        return [weight, goal];
    };

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
    ['$scope', '$location', 'weightDataService', '$mdBottomSheet', '$mdToast',
        function($scope, $location, weightDataService, $mdBottomSheet, $mdToast) {

            $scope.selectedOption = 'summary'; // check not null
            $scope.selectOption= selectOption;
            $scope.showAddWeightBottomSheet = showAddWeightBottomSheet;

            function selectOption(option) {
                console.log('select');
                $scope.selectedOption = option;
                $location.path(option);
            }

            function showAddWeightBottomSheet() {
                $mdBottomSheet.show({
                    templateUrl: '/client/controllers/weight/history/addWeightBottomSheet.ejs',
                    controller: 'AddWeightBottomSheetCtrl',
                    clickOutsideToClose: true
                }).then(function(hideMsg) {
                    $scope.showSimpleToast(hideMsg);
                }, function(cancelMsg) {

                });
            }

            $scope.showSimpleToast = function(message) {
                var pinTo = "top right";
                $mdToast.show(
                    $mdToast.simple()
                        .textContent(message)
                        .position(pinTo )
                        .hideDelay(600)
                );
            };

        }]);

app.controller('AddWeightBottomSheetCtrl',
    ['$scope', '$mdBottomSheet', 'weightDataService', '$rootScope', 
    function($scope, $mdBottomSheet, weightDataService, $rootScope) {
        $scope.date = new Date();
        $scope.weight = '';

        $scope.addNewWeight = function() {
            // TODO: validate
            weightDataService.weightData.push({
                date: $scope.date,
                weight: $scope.weight
            });

            $rootScope.$broadcast(weightDataService.Constant.updated);
            $mdBottomSheet.hide("succeed");
        }
    }]);
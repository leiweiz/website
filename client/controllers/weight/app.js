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

        var minY = goalWeight;
        var maxY = goalWeight;

        for (var i = 0; i < weightData.length; i++) {
            var d = weightData[i];
            var xVal = d.date.getDate() + '/' + (d.date.getMonth() + 1);

            weight.x.push(xVal);
            weight.y.push(d.weight);

            minY = Math.min(d.weight, minY);
            maxY = Math.max(d.weight, maxY);

            goal.x.push(xVal);
            goal.y.push(goalWeight);
        }

        minY -= 5;
        maxY += 5;
        self.layout.yaxis.range = [minY, maxY];

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
                redirectTo: '/history'
            });
    }]);

app.controller('WeightController',
    ['$scope', '$location', 'weightDataService', '$mdDialog', '$mdToast', '$mdMedia',
        function($scope, $location, weightDataService, $mdDialog, $mdToast, $mdMedia ) {

            $scope.selectedOption = 'history';
            $scope.selectOption= selectOption;
            $scope.showAddWeightDialog = showAddWeightDialog;
            $scope.title = getTitle();

            function getTitle() {
                return $location.path().split('/')[1];
            }

            function selectOption(option) {
                $scope.selectedOption = option;
                $location.path(option);
                $scope.title = getTitle();
            }

            function showAddWeightDialog(ev) {
                var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'))  && $scope.customFullscreen;
                $mdDialog.show({
                    templateUrl: '/client/controllers/weight/history/addWeightDialogTemplate.ejs',
                    controller: 'AddWeightDialogCtrl',
                    clickOutsideToClose: true,
                    parent: angular.element(document.body),
                    targetEvent: ev,
                    fullscreen: true
                }).then(function(hideMsg) {
                    $scope.showSimpleToast(hideMsg);
                }, function(cancelMsg) {
                    $scope.showSimpleToast(cancelMsg || 'exit');
                });

                $scope.$watch(function() {
                    return $mdMedia('xs') || $mdMedia('sm');
                }, function(wantsFullScreen) {
                    $scope.customFullscreen = (wantsFullScreen === true);
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

app.controller('AddWeightDialogCtrl',
    ['$scope', '$mdDialog', 'weightDataService', '$rootScope', 
    function($scope, $mdDialog, weightDataService, $rootScope) {
        $scope.date = new Date();
        $scope.weight = '';

        $scope.cancel = function() {
            $mdDialog.cancel('cancelled');
        };

        $scope.addNewWeight = function() {
            // TODO: validate
            weightDataService.weightData.push({
                date: $scope.date,
                weight: $scope.weight
            });

            $rootScope.$broadcast(weightDataService.Constant.updated);
            $mdDialog.hide("succeed");
        }
    }]);
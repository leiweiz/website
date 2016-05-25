/**
 * Created by lei on 5/24/16.
 */

var app = angular.module('MyApp', ['ngMaterial'])
    .run(function() {
        console.log('MyApp is ready!');
    });

app.controller('SimulationController', ['$scope', 'SampleService', 'SettingService', 'SimulationService', 'UtilsService',
    function($scope, SampleService, SettingService, SimulationService, UtilsService) {
        $scope.step = 1;

        var simulation = new SimulationService.SimulationFactory(Plotly, 'mySim', 'myTime',
            UtilsService, SettingService, SampleService.Sample);

        $scope.selectedIndices = simulation.selectedIndices;
        $scope.probability = simulation.probability;
        $scope.updatedSampleIndex = simulation.updatedSampleIndex;
        $scope.updatedTime = simulation.updatedTime;
        $scope.selectedSamples = simulation.selectedSamples;

        simulation.draw();

        $scope.simulate = function(step) {
            var value = parseInt(step);
            if (value > 0) {
                for(var i = 0; i < step; i++) {
                    simulation.simulate();
                    $scope.probability = simulation.probability;
                    $scope.updatedSampleIndex = simulation.updatedSampleIndex;
                    $scope.updatedTime = simulation.updatedTime;
                    $scope.selectedSamples = simulation.selectedSamples;
                }
            }
        }

}]);
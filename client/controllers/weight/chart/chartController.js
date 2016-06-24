/**
 * Created by lei on 6/21/16.
 */

app.controller('ChartController',
    ['$scope', 'weightDataService', 'graphService',
        function ($scope, weightDataService, graphService) {

            // https://plot.ly/javascript/
            $scope.weightData = weightDataService.weightData;
            graphService.draw('historyChart', $scope.weightData, weightDataService.goalWeight);

            $scope.$on(weightDataService.Constant.updated, function(event, args) {
                $scope.weightData = weightDataService.weightData;
                graphService.draw('historyChart', $scope.weightData, weightDataService.goalWeight);
            });

        }]);
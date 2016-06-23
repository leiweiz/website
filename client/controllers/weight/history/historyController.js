/**
 * Created by lei on 6/21/16.
 */

app.controller('HistoryController',
    ['$scope', 'weightDataService', 
    function ($scope, weightDataService) {

        $scope.weightData = weightDataService.weightData;

        $scope.$on('weightDataService:update', function(event, args) {
            $scope.weightData = weightDataService.weightData;
        });
    }]);
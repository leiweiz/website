/**
 * Created by lei on 6/21/16.
 */

app.controller('HistoryController',
    ['$scope', 'weightDataService', 
    function ($scope, weightDataService) {

        $scope.weightData = weightDataService.weightData.sort(function(a, b){return b.date- a.date});

        $scope.$on(weightDataService.Constant.updated, function(event, args) {
            $scope.weightData = weightDataService.weightData.sort(function(a, b){return b.date- a.date});
        });

        $scope.weekday = new Array(7);
        $scope.weekday[0]=  "Sun";
        $scope.weekday[1] = "Mon";
        $scope.weekday[2] = "Tue";
        $scope.weekday[3] = "Wed";
        $scope.weekday[4] = "Thu";
        $scope.weekday[5] = "Fri";
        $scope.weekday[6] = "Sat";

    }]);
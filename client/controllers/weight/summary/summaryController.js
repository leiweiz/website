/**
 * Created by lei on 6/21/16.
 */

app.controller('SummaryController',
    ['$scope', 'weightDataService',
        function ($scope, weightDataService) {

            $scope.summaryData = getSummaryInfo(weightDataService);


            $scope.$on(weightDataService.Constant.updated, function(event, args) {
                $scope.summaryData = getSummaryInfo(weightDataService);
            });

            function getSummaryInfo(wds) {
                var result = {};
                result.goalWeight = wds.goalWeight;
                var allData = wds.weightData.sort(function(a, b){return a.date- b.date});
                result.originWeight = allData[0].weight | 'no data info';
                result.currentWeight = allData[allData.length-1].weight | 'no data info';

                return result
            }

        }]);
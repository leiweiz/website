/**
 * Created by lei on 6/21/16.
 */

app.controller('SettingsController',
    ['$scope', 'weightDataService', '$mdBottomSheet', '$mdToast',
        function ($scope, weightDataService, $mdBottomSheet, $mdToast) {

            $scope.goalWeight = weightDataService.goalWeight;
            $scope.showEditGoalWeightBottomSheet = showEditGoalWeightBottomSheet;

            function showEditGoalWeightBottomSheet() {
                $mdBottomSheet.show({
                    templateUrl: '/client/controllers/weight/settings/editGoalWeightBottomSheet.ejs',
                    controller: 'EditGoalWeightBottomSheetCtrl',
                    clickOutsideToClose: true
                }).then(function(hideMsg) {
                    $scope.goalWeight = weightDataService.goalWeight;
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

app.controller('EditGoalWeightBottomSheetCtrl',
    ['$scope', '$mdBottomSheet', 'weightDataService',
        function($scope, $mdBottomSheet, weightDataService) {
            $scope.goalWeight = weightDataService.goalWeight;

            $scope.editGoalWeight = function() {
                // TODO: validate
                weightDataService.goalWeight = $scope.goalWeight;
                $mdBottomSheet.hide("succeed");
            }
        }]);
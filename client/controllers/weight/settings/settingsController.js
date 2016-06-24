/**
 * Created by lei on 6/21/16.
 */

app.controller('SettingsController',
    ['$scope', 'weightDataService', '$mdDialog', '$mdToast', '$mdMedia',
        function ($scope, weightDataService, $mdDialog, $mdToast, $mdMedia) {

            $scope.goalWeight = weightDataService.goalWeight;
            $scope.showEditGoalDialog = showEditGoalDialog;

            function showEditGoalDialog(ev) {
                var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'))  && $scope.customFullscreen;
                $mdDialog.show({
                    templateUrl: '/client/controllers/weight/settings/editGoalWeightDialogTemplate.ejs',
                    controller: 'EditGoalWeightDialogCtrl',
                    clickOutsideToClose: true,
                    parent: angular.element(document.body),
                    targetEvent: ev,
                    fullscreen: true
                }).then(function(hideMsg) {
                    $scope.goalWeight = weightDataService.goalWeight;
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
                        .position(pinTo)
                        .hideDelay(600)
                );
            };

        }]);

app.controller('EditGoalWeightDialogCtrl',
    ['$scope', '$mdDialog', 'weightDataService',
        function($scope, $mdDialog, weightDataService) {
            $scope.goalWeight = weightDataService.goalWeight;

            $scope.cancel = function() {
                $mdDialog.cancel('cancelled');
            };

            $scope.editGoalWeight = function() {
                // TODO: validate
                weightDataService.goalWeight = $scope.goalWeight;
                $mdDialog.hide("succeed");
            }
        }]);
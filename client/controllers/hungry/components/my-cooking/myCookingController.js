/**
 * Created by lei on 5/19/16.
 */

app.controller('MyCookingController', ['$scope', '$routeParams', '$mdMedia', '$mdDialog',
    function ($scope, $routeParams, $mdMedia, $mdDialog) {
        $scope.selectedDirection = 'up';
        $scope.selectedMode = 'md-fling';
        $scope.isOpen = false;

        $scope.showAddFood = function(ev) {
            var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'))  && $scope.customFullscreen;
            $mdDialog.show({
                controller: DialogController,
                templateUrl: '/client/controllers//hungry/components/my-cooking/addFoodDialogTemplate.ejs',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose:true,
                fullscreen: useFullScreen
            })
                .then(function() {
                    $scope.status = 'succeed';
                }, function() {
                    $scope.status = 'You cancelled the dialog.';
                });
            $scope.$watch(function() {
                return $mdMedia('xs') || $mdMedia('sm');
            }, function(wantsFullScreen) {
                $scope.customFullscreen = (wantsFullScreen === true);
            });
        };

    }]);

function DialogController($scope, $mdDialog) {
    $scope.newFood = {
        name: 'a'
    };

    $scope.hide = function() {
        $mdDialog.hide();
    };
    $scope.cancel = function() {
        $mdDialog.cancel();
    };
    $scope.submit = function() {
        // to do submit
        $mdDialog.hide();
    };
}
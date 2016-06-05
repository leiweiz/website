/**
 * Created by lei on 5/19/16.
 */

app.controller('MyCookingController', ['$scope', '$routeParams', '$mdMedia', '$mdDialog', '$mdToast',
    function ($scope, $routeParams, $mdMedia, $mdDialog, $mdToast) {
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
                    $scope.showSimpleToast('added new food');
                }, function() {
                    $scope.status = 'You cancelled the dialog.';
                    $scope.showSimpleToast('cancelled');
                });
            $scope.$watch(function() {
                return $mdMedia('xs') || $mdMedia('sm');
            }, function(wantsFullScreen) {
                $scope.customFullscreen = (wantsFullScreen === true);
            });
        };

        $scope.showSimpleToast = function(message) {
            var pinTo = "top right";
            $mdToast.show(
                $mdToast.simple()
                    .textContent(message)
                    .position(pinTo )
                    .hideDelay(2000)
            );
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
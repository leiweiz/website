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
                templateUrl: '/client/controllers/hungry/components/my-cooking/addFoodDialogTemplate.ejs',
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

function DialogController($scope, $mdDialog, $http) {
    $scope.newFood = {
        description: ''
    };

    var selectedPhotoFile;

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


    $scope.submit = function(){
        if (!$scope.files || $scope.files.length === 0) {
            console.error("uploadPhoto called will no selected file");
            return;
        }
        // ?? if we do not keep pointer with following line
        // $scope.files[0].lfFile in formData.append() will throw error
        selectedPhotoFile = $scope.files[0].lfFile;
        console.log('fileSubmitted', selectedPhotoFile);
        var formData = new FormData();
        formData.append('uploadphoto', selectedPhotoFile);
        formData.append('description', $scope.newFood.description);
        $http.post('/photos/new', formData, {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined}
        }).then(function(response){
            // do sometingh
        },function(err){
            // do sometingh
        });
    };
}
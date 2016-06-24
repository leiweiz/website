/**
 * Created by lei on 5/19/16.
 */

app.controller('MyCookingController',
    ['$scope', '$routeParams', '$mdMedia', '$mdDialog', '$mdToast', '$rootScope', '$resource',
    function ($scope, $routeParams, $mdMedia, $mdDialog, $mdToast, $rootScope, $resource) {
        $scope.selectedDirection = 'up';
        $scope.selectedMode = 'md-fling';
        $scope.isOpen = false;
        $scope.loginUser = $rootScope.loginUser;
        $scope.deletePhoto = deletePhoto;

        updatePhotosOfUser();

        $scope.showAddFood = function(ev) {
            var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'))  && $scope.customFullscreen;
            $mdDialog.show({
                controller: AddDialogController,
                templateUrl: '/client/controllers/hungry/components/my-cooking/addFoodDialogTemplate.ejs',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose:true
            })
                .then(function(msg) {
                    $scope.status = 'succeed';
                    $scope.showSimpleToast('added new food');
                    // TODO, use jQuery to add new photo
                    updatePhotosOfUser();
                }, function(msg) {
                    $scope.status = 'You cancelled the dialog.';
                    $scope.showSimpleToast('cancelled');
                });
            $scope.$watch(function() {
                return $mdMedia('xs') || $mdMedia('sm');
            }, function(wantsFullScreen) {
                $scope.customFullscreen = (wantsFullScreen === true);
            });
        };


        $scope.showEditFood = function(ev, photoId) {
            var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'))  && $scope.customFullscreen;
            $mdDialog.show({
                controller: EditDialogController,
                templateUrl: '/client/controllers/hungry/components/my-cooking/editFoodDialogTemplate.ejs',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: true,
                fullscreen: useFullScreen,
                locals : {
                    photoId : photoId
                }
            })
                .then(function(msg) {
                    $scope.status = 'succeed';
                    $scope.showSimpleToast('edited food');
                    // TODO, use jQuery to add new photo
                    updatePhotosOfUser();
                }, function(msg) {
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

        function updatePhotosOfUser() {
            var Photo = $resource('/photosOfUser/:userId', {userId:'@id'}, {query: {method: 'get', isArray: true}});
            Photo.query({userId: $scope.loginUser._id}, function(photos) {
                $scope.photos = photos;
                console.log("photos of User", photos);
            });
        }

        function deletePhoto(photoId) {
            var Photo = $resource('/photos/:photoId', {photoId: '@id'}, {delete: {method: 'delete'}});
            Photo.delete({photoId: photoId}, function(res) {
                console.log(res);
                if (res.succeed) {
                    // TODO, use jQuery
                    $scope.showSimpleToast('photo deleted');
                    updatePhotosOfUser();
                } else {
                    $scope.showSimpleToast('failed to delete');
                }
            });
        }

    }]);

function AddDialogController($scope, $mdDialog, $http) {
    $scope.newFood = {
        description: '',
        price: '',
        name: ''
    };

    var selectedPhotoFile;

    $scope.hide = function() {
        $mdDialog.hide();
    };
    $scope.cancel = function() {
        $mdDialog.cancel();
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
        formData.append('price', $scope.newFood.price);
        formData.append('food_name', $scope.newFood.name);

        $http.post('/photos/new', formData, {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined}
        }).then(function(response){
            // do sometingh
            $mdDialog.hide(response);
        },function(err){
            // do sometingh
            $mdDialog.cancel();
        });
    };
}

// pass data to dialog
// https://github.com/angular/material/issues/1016
function EditDialogController($scope, $mdDialog, photoId, $resource) {
    $scope.editFood = {
        description: '',
        price: '',
        name: ''
    };
    $scope.photoId = photoId;

    $scope.hide = function() {
        $mdDialog.hide();
    };
    $scope.cancel = function() {
        $mdDialog.cancel();
    };

    $scope.submit = function(){
        var Photo = $resource('/photos/:photoId', {photoId: '@id'}, {update: {method: 'put'}});
        console.log($scope.photoId);
        Photo.update({ photoId: $scope.photoId }, $scope.editFood,
            function(res) {
                console.log(res);
                if (res.succeed) {
                    // TODO, use jQuery
                    $mdDialog.hide(res);
                } else {
                    $mdDialog.cancel('edit fails');
                }
            });
    };
}
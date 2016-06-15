/**
 * Created by lei on 5/19/16.
 */
'use strict';

app.controller('FoodsController',
    ['$scope', '$routeParams', '$rootScope', '$http', '$mdMedia', '$mdDialog', '$mdToast',
    function ($scope, $routeParams, $rootScope, $http, $mdMedia, $mdDialog, $mdToast) {
        $scope.loginUser = $rootScope.loginUser;
        updatePhotos();

        function updatePhotos() {
            $http.get('/photos/list').then(function(res) {
                if (res.status === 200){
                    return $scope.photos = res.data;
                }
                console.log('fails', res.status);
            });
        }

        $scope.showPhotoDetail = function(ev) {
            var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'))  && $scope.customFullscreen;
            $mdDialog.show({
                controller: PhotoDetailDialogController,
                templateUrl: '/client/controllers/hungry/components/foods/PhotoDetailDialogTemplate.ejs',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose:true,
                fullscreen: useFullScreen
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

    }]);

function PhotoDetailDialogController($scope, $mdDialog, $http) {
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
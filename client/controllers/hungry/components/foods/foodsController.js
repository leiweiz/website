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

        $scope.showPhotoDetail = function(ev, photo) {
            var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'))  && $scope.customFullscreen;
            $mdDialog.show({
                controller: PhotoDetailDialogController,
                templateUrl: '/client/controllers/hungry/components/foods/PhotoDetailDialogTemplate.ejs',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose:true,
                fullscreen: useFullScreen,
                locals : {
                    photo: photo
                }
            })
                .then(function(msg) {
                    $scope.status = 'succeed';
                    $scope.showSimpleToast('added new comment');
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

    }]);

function PhotoDetailDialogController($scope, $mdDialog, $http, photo) {
    $scope.photo = photo;
    $scope.comments = {};
    updateComments();

    $scope.hide = function() {
        $mdDialog.hide();
    };
    $scope.cancel = function() {
        $mdDialog.cancel();
    };

    $scope.submit = function(){

    };

    function updateComments(){
        $http({
            method: 'GET',
            url: '/commentsOfPhoto/' + $scope.photo._id
        }).then(function successCallback(response) {
            console.log('succeed');
            $scope.comments = response.data;
        }, function errorCallback(response) {
            console.log('error');
            console.log(response);
        });
    }
}
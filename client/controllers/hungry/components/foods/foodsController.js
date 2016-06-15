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

function PhotoDetailDialogController($scope, $mdDialog, $http, photo, $mdToast) {
    $scope.photo = photo;
    $scope.comments = {};
    $scope.userComment = '';
    var url = '/commentsOfPhoto/' + $scope.photo._id;

    updateComments();

    $scope.hide = function() {
        $mdDialog.hide();
    };
    $scope.cancel = function() {
        $mdDialog.cancel();
    };

    $scope.commentOnPhoto = function(){
        $http.post(url, {"comment":$scope.userComment})
            .then(function successCallback(response) {
                console.log('succeed');
                updateComments();
                $scope.userComment = '';
                $scope.showSimpleToast('added new comment');
            }, function errorCallback(response) {
                console.log('fail');
                console.log(response);
                $scope.showSimpleToast('failed');
            });
    };

    function updateComments(){
        $http({
            method: 'GET',
            url: url
        }).then(function successCallback(response) {
            console.log('succeed');
            $scope.comments = response.data;
        }, function errorCallback(response) {
            console.log('error');
            console.log(response);
        });
    }

    $scope.showSimpleToast = function(message) {
        var pinTo = "top right";
        $mdToast.show(
            $mdToast.simple()
                .textContent(message)
                .position(pinTo )
                .hideDelay(2000)
        );
    };
}
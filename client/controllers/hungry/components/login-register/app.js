/**
 * Created by lei on 6/5/16.
 */

var app = angular.module('LoginRegisterApp', ['ngRoute', 'ngMaterial', 'ngMdIcons'])
    .run(function() {
        console.log('LoginRegisterApp is ready!');
    });

app.controller('LoginRegisterController',['$scope', '$routeParams', '$mdMedia', '$mdDialog', '$mdToast', '$window',
    function ($scope, $routeParams, $mdMedia, $mdDialog, $mdToast, $window) {
        $scope.message = 'hello';

        $scope.selectedDirection = 'up';
        $scope.selectedMode = 'md-fling';
        $scope.isOpen = false;


        $scope.showLogin = function(ev) {
            var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'))  && $scope.customFullscreen;
            $mdDialog.show({
                controller: LoginDialogController,
                templateUrl: '/client/controllers/hungry/components/login-register/loginDialogTemplate.ejs',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose:true,
                fullscreen: useFullScreen
            })
                .then(function() {
                    $scope.status = 'succeed';
                    $scope.showSimpleToast('login succeed');
                    //$window.location.href = '/hungry'; // redirect to foods page
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

        $scope.showRegister = function(ev) {
            var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'))  && $scope.customFullscreen;
            $mdDialog.show({
                controller: RegisterDialogController,
                templateUrl: '/client/controllers/hungry/components/login-register/registerDialogTemplate.ejs',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose:true,
                fullscreen: useFullScreen
            })
                .then(function() {
                    $scope.status = 'succeed';
                    $scope.showSimpleToast('register succeed');
                    //$window.location.href = '/hungry'; // redirect to foods page
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

function LoginDialogController($scope, $mdDialog) {
    $scope.loginUser = {
        loginName: '',
        password: ''
    };

    $scope.hide = function() {
        $mdDialog.hide();
    };
    $scope.cancel = function() {
        $mdDialog.cancel();
    };
    $scope.login = function() {
        // to do submit
        $mdDialog.hide();
    };
}


function RegisterDialogController($scope, $mdDialog) {
    $scope.newRegister = {
        firstName: '',
        lastName: '',
        loginName: '',
        password: '',
        confirmedPassword: '',
        address: {
            address: '',
            city: '',
            state: '',
            zipCode: ''
        },
        telephone: ''
    };

    $scope.hide = function() {
        $mdDialog.hide();
    };
    $scope.cancel = function() {
        $mdDialog.cancel();
    };
    $scope.register = function() {
        // to do submit
        $mdDialog.hide();
    };
}
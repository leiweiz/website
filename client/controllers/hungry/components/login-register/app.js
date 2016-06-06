/**
 * Created by lei on 6/5/16.
 */

var app = angular.module('LoginRegisterApp', ['ngRoute', 'ngMaterial', 'ngMdIcons', 'ngResource'])
    .run(function() {
        console.log('LoginRegisterApp is ready!');
    });

app.controller('LoginRegisterController',['$scope', '$resource', '$mdMedia', '$mdDialog', '$mdToast', '$window',
    function ($scope, $resource, $mdMedia, $mdDialog, $mdToast, $window) {
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
                .then(function(msg) {
                    $scope.status = 'succeed';
                    $scope.showSimpleToast('login succeed');

                    if (msg.succeed) {
                        $window.location.href = '/hungry'; // redirect to foods pag
                    }
                }, function(msg) {
                    $scope.status = 'You cancelled the dialog.';
                    $scope.showSimpleToast(msg);
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
                .then(function(msg) {
                    $scope.status = 'succeed';
                    $scope.showSimpleToast('register succeed');

                    if (msg.succeed) {
                        $window.location.href = '/hungry'; // redirect to foods pag
                    }
                }, function(msg) {
                    $scope.status = 'You cancelled the dialog.';
                    $scope.showSimpleToast(msg);
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

function LoginDialogController($scope, $mdDialog, $resource) {
    $scope.loginUser = {
        login_name: '',
        password: ''
    };

    $scope.hide = function() {
        $mdDialog.hide();
    };
    $scope.cancel = function() {
        $mdDialog.cancel();
    };
    $scope.login = function() {
        console.log($scope.loginUser);
        var loginRequest = $resource("/admin/login");
        loginRequest.save( $scope.loginUser, function(res) {
            console.log(res);
            $mdDialog.hide(res);
        }, function() {
            console.log('fail');
            $mdDialog.cancel('login fail');
        });
    };
}


function RegisterDialogController($scope, $mdDialog, $resource) {
    $scope.newRegister = {
        first_name: '',
        last_name: '',
        login_name: '',
        password: '',
        confirmed_password: '',
        address: {
            address: '',
            city: '',
            state: '',
            zip_code: ''
        },
        telephone: ''
    };
    $scope.error = '';

    $scope.hide = function() {
        $mdDialog.hide();
    };
    $scope.cancel = function() {
        $mdDialog.cancel();
    };
    $scope.register = function() {
        if (!$scope.validate()) {
            $mdDialog.cancel($scope.error || 'not valid register information');
            return;
        }

        var registerRequest = $resource("/user");

        registerRequest.save($scope.newRegister, function(res) {
            console.log(res);
            $mdDialog.hide(res);
        }, function() {
            console.log('fail');
            $mdDialog.cancel('register fail');
        });
    };
    $scope.validate = function() {
        console.log($scope.newRegister);
        if (!$scope.newRegister.first_name || $scope.newRegister.first_name === '') {
            $scope.error = "first name is not valid";
            return false;
        }
        if (!$scope.newRegister.last_name || $scope.newRegister.last_name === '') {
            $scope.error = "last name is not valid";
            return false;
        }
        if (!$scope.newRegister.login_name || $scope.newRegister.login_name === '') {
            $scope.error = "login name is not valid";
            return false;
        }
        if (!$scope.newRegister.password || $scope.newRegister.password === '') {
            $scope.error = "password is not correct";
            return false;
        }
        if (!$scope.newRegister.confirmed_password || $scope.newRegister.password !== $scope.newRegister.confirmed_password) {
            $scope.error = "confirmed password doesn't match password";
            return false;
        }
        // address ?
        return true;
    }
}
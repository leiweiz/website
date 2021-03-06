/**
 * Created by lei on 6/5/16.
 */

var app = angular.module('LoginRegisterApp',
    ['ngRoute', 'ngMaterial', 'ngMdIcons', 'ngResource', 'ngCookies', 'ngMessages'])
    .run(function() {
        console.log('LoginRegisterApp is ready!');
    });

app.controller('LoginRegisterController',
    ['$scope', '$resource', '$mdMedia', '$mdDialog', '$mdToast', '$window', '$cookies', '$http',
        function ($scope, $resource, $mdMedia, $mdDialog, $mdToast, $window, $cookies, $http) {
            $scope.message = 'hello';

            $scope.selectedDirection = 'up';
            $scope.selectedMode = 'md-fling';
            $scope.isOpen = false;

            updatePhotos();

            function updatePhotos() {
                $http.get('/photos/list').then(function(res) {
                    if (res.status === 200){
                        return $scope.photos = res.data;
                    }
                    console.log('fails', res.status);
                });
            }

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
                    .then(function(user) {
                        $cookies.put('userId', user._id);
                        $scope.status = 'succeed';
                        $scope.showSimpleToast('login succeed');

                        if (user._id) {
                            console.log("login: ", user);
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
                    .then(function(user) {
                        $cookies.put('userId', user._id);
                        $scope.status = 'succeed';
                        $scope.showSimpleToast('register succeed');

                        if (user._id) {
                            console.log("register: ", user);
                            $window.location.href = '/hungry'; // redirect to foods pag
                        }
                    }, function(msg) {
                        $scope.status = 'You cancelled the registration.';
                        $scope.showSimpleToast(msg || $scope.status);
                    });
                $scope.$watch(function() {
                    return $mdMedia('xs') || $mdMedia('sm');
                }, function(wantsFullScreen) {
                    $scope.customFullscreen = (wantsFullScreen === true);
                });
            };

            $scope.showPhotoDetail = function(ev, photo) {
                var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'))  && $scope.customFullscreen;
                $mdDialog.show({
                    controller: PhotoDetailDialogController,
                    templateUrl: '/client/controllers/hungry/components/login-register/PhotoDetailDialogTemplate.ejs',
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
        telephone: '',
        email_address: ''
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
            console.log($scope.error);
            return;
        }

        var registerRequest = $resource("/user");

        registerRequest.save($scope.newRegister, function(res) {
            console.log(res);
            $mdDialog.hide(res);
        }, function() {
            console.log('fail');
            $mdDialog.cancel("login name exists");
        });
    };
    $scope.validate = function() {
        console.log($scope.newRegister);
        if (!$scope.newRegister.first_name ||
            $scope.newRegister.first_name === '' ||
            $scope.newRegister.first_name.length > 15) {
            $scope.error = "first name is not valid";
            return false;
        }
        if (!$scope.newRegister.last_name ||
            $scope.newRegister.last_name === '' ||
            $scope.newRegister.last_name.length > 15) {
            $scope.error = "last name is not valid";
            return false;
        }
        if (!$scope.newRegister.login_name ||
            $scope.newRegister.login_name === '' ||
            $scope.newRegister.login_name.length < 6 ||
            $scope.newRegister.login_name.length > 20) {
            $scope.error = "login name is not valid";
            return false;
        }
        if (!$scope.newRegister.email_address ||
            $scope.newRegister.email_address === '' ||
            $scope.newRegister.email_address.length < 5 ||
            $scope.newRegister.email_address.length > 30 ||
            !$scope.newRegister.email_address.match(/^.+@.+\..+$/)) {
            $scope.error = "email address is not valid";
            return false;
        }
        if (!$scope.newRegister.password ||
            $scope.newRegister.password === '' ||
            $scope.newRegister.password.length < 6 ||
            $scope.newRegister.password.length > 20) {
            $scope.error = "password is not correct";
            return false;
        }
        if (!$scope.newRegister.confirmed_password ||
            $scope.newRegister.password !== $scope.newRegister.confirmed_password) {
            $scope.error = "confirmed password doesn't match password";
            return false;
        }
        if (!$scope.newRegister.address.address ||
            $scope.newRegister.address.address === '' ||
            $scope.newRegister.address.address.length > 100) {
            $scope.error = "address is not valid";
            return false;
        }
        if (!$scope.newRegister.address.city ||
            $scope.newRegister.address.city === '' ||
            $scope.newRegister.address.city.length > 100) {
            $scope.error = "city is not valid";
            return false;
        }
        // TODO check state
        if (!$scope.newRegister.address.zip_code ||
            $scope.newRegister.address.zip_code === '' ||
            !$scope.newRegister.address.zip_code.match(/^\d{5}$/)) {
            $scope.error = "zip code is not valid";
            return false;
        }
        if (!$scope.newRegister.telephone ||
            $scope.newRegister.telephone === '' ||
            !$scope.newRegister.telephone.match(/^\d{3}-\d{3}-\d{4}$/)) {
            $scope.error = "telephone is not valid";
            return false;
        }
        return true;
    }
}

function PhotoDetailDialogController($scope, $mdDialog, $http, photo) {
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
}
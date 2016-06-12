/**
 * Created by lei on 5/19/16.
 */

app.controller('SettingsController',
    ['$scope', '$routeParams', '$rootScope', '$http', '$window', '$mdMedia', '$mdDialog', '$mdToast',
    function ($scope, $routeParams, $rootScope, $http, $window, $mdMedia, $mdDialog, $mdToast) {
        $scope.loginUser = $rootScope.loginUser;
        $scope.logout = logoutUser;

        function logoutUser() {
            $http.post('/admin/logout')
                .then(function(res) {
                    $rootScope.loginUser = null;
                    $window.location.href = '/hungry/login-register'; // redirect to foods pag
                }, function(err){
                    console.log('fail');
                });
        }


        $scope.showUpdatePassword = function(ev) {
            var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'))  && $scope.customFullscreen;
            $mdDialog.show({
                controller: PasswordDialogController,
                templateUrl: '/client/controllers/hungry/components/settings/passwordDialogTemplate.ejs',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose:true,
                fullscreen: useFullScreen
            })
                .then(function(msg) {
                    $scope.status = 'succeed';
                    $scope.showSimpleToast('updated password');
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


function PasswordDialogController($scope, $mdDialog, $resource, $rootScope) {
    $scope.password = {
        old_password: '',
        new_password: '',
        confirmed_password: ''
    };

    $scope.hide = function() {
        $mdDialog.hide();
    };
    $scope.cancel = function() {
        $mdDialog.cancel('closed dialog');
    };

    $scope.submit = function(){

        if (!validPassword()) {
            $mdDialog.cancel('two passwords are not equal');
            return;
        }

        var passwordRequest = $resource('/password/:userId', {userId: '@id'}, {update: {method: 'post'}});
        passwordRequest.update({ userId: $rootScope.loginUser._id }, $scope.password,
            function(res) {
                console.log(res);
                if (res.succeed) {
                    $mdDialog.hide(res);
                } else {
                    $mdDialog.cancel('edit fails');
                }
            });
    };

    function validPassword() {
        return $scope.password.new_password === $scope.password.confirmed_password;
    }
}
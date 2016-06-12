/**
 * Created by lei on 5/19/16.
 */

app.controller('SettingsController', ['$scope', '$routeParams', '$rootScope', '$http', '$window',
    function ($scope, $routeParams, $rootScope, $http, $window) {
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

    }]);
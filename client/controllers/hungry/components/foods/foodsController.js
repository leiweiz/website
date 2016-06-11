/**
 * Created by lei on 5/19/16.
 */
'use strict';

app.controller('FoodsController', ['$scope', '$routeParams', '$rootScope', '$http',
    function ($scope, $routeParams, $rootScope, $http) {
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
    }]);
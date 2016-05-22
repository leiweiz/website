/**
 * Created by lei on 5/20/16.
 */

var app = angular.module('MyApp', ['ngMaterial', 'ngResource'])
    .run(function() {
        console.log('MyApp is ready!');
    });

app.service('UserListService', function() {
   var self = this;
    self.userList = [{
        firstname: 'leiwei',
        lastname: 'zheng',
        address: '55 dinsmore ave',
        avatar: 'avatar-1.svg',
        content: 'my content'
    }];
});

app.controller('UserFormController', ['$scope', '$http', '$resource', 'UserListService', function($scope, $http, $resource, UserListService) {
    var self = this;
    var userReq = $resource('/to-do-list', {}, {});
    $scope.userList = '';

    // conflict with /to-do-list/:id
    function getAllUsers() {
        $http.get('/to-do-list/userList').success(function(data) {
            console.log(data);
        });
    }

    $scope.submitForm = function() {

        $http({
            url: '/to-do-list',
            method: "POST",
            data: JSON.stringify($scope.user),
            headers: {'Content-Type': 'application/json'}
        }).success(function (data, status, headers, config) {
            console.log('succeed');
            $scope.userList = data;
            $scope.user = '';
        }).error(function (data, status, headers, config) {
            console.log('fail');
        });
    }
}]);
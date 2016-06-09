/**
 * Created by lei on 5/19/16.
 */

var app = angular.module('MyApp', ['ngRoute', 'ngMaterial', 'ngMdIcons', 'lfNgMdFileInput', 'ngCookies'])
    .run(function() {
        console.log('MyApp is ready!');
    });

app.config(function($mdThemingProvider) {
    $mdThemingProvider.theme('default')
        .primaryPalette('brown')
        .accentPalette('red');
});

app.config(['$routeProvider',
    function ($routeProvider) {
        $routeProvider.
            when('/foods', {
                templateUrl: '/client/controllers/hungry/components/foods/foodsTemplate.ejs',
                controller: 'FoodsController'
            }).
            when('/my-cooking', {
                templateUrl: '/client/controllers//hungry/components/my-cooking/my-cookingTemplate.ejs',
                controller: 'MyCookingController'
            }).
            when('/settings', {
                templateUrl: '/client/controllers//hungry/components/settings/settingsTemplate.ejs',
                controller: 'SettingsController'
            }).
            otherwise({
                redirectTo: '/foods'
            });
    }]);

app.service('MenuOptionService', function() {
    // use "this"
    var self = this;
    self.options = [
        {
            name: 'Foods',
            image: 'food.svg',
            url: 'foods'
        },
        {
            name: 'My Cooking',
            image: 'my-cooking.svg',
            url: 'my-cooking'
        },
        {
            name: 'Settings',
            image: 'settings.svg',
            url: 'settings'
        }
    ];
});

app.controller('HungryController', ['MenuOptionService', '$mdSidenav', '$location',
    function(MenuOptionService, $mdSidenav, $location) {
        var self = this;

        self.options = MenuOptionService.options;
        self.selectedOption = self.options[0]; // check not null
        self.selectOption= selectOption;
        self.toggleList = toggleList;

        function selectOption(option) {
            self.selectedOption = option;
            $location.path(option.url);
        }

        function toggleList() {
            $mdSidenav('left').toggle();
        }


    }]);
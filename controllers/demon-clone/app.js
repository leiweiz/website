/**
 * Created by lei on 5/16/16.
 */

var app = angular.module('MyApp', ['ngMaterial', 'ngMdIcons'])
    .run(function() {
        console.log('MyApp is ready!');
    });

app.config(function($mdThemingProvider) {
    $mdThemingProvider.theme('default')
        .primaryPalette('brown')
        .accentPalette('red');
});

app.service('UserService', function() {
    // use "this"
    var self = this;
    self.users = [
        {
            name: 'name1',
            avatar: 'avatar-1.svg',
            content: 'name1-content1'
        },
        {
            name: 'name2',
            avatar: 'avatar-2.svg',
            content: 'name2-content2'
        },
        {
            name: 'name3',
            avatar: 'avatar-3.svg',
            content: 'name3-content3'
        },
        {
            name: 'name4',
            avatar: 'avatar-4.svg',
            content: 'name4-content4'
        }
    ];
});

app.controller('UserController', ['UserService', '$mdBottomSheet', '$mdSidenav',
    function(userService, $mdBottomSheet, $mdSidenav) {
        var self = this;

        self.users = userService.users;
        self.selected = self.users[0]; // check not null
        self.selectUser = selectUser;
        self.toggleList = toggleList;
        self.share = share; //share

        function selectUser(user) {
            self.selected = user;
        }

        function toggleList() {
            $mdSidenav('left').toggle();
        }

        function share(selectedUser) {
            $mdBottomSheet.show({
                controller: UserSheetController,
                controllerAs: 'vm',
                templateUrl: '/views/demo-clone-template/bottomsheet.ejs',
                parent: angular.element(document.querySelector('#content'))
            });

            function UserSheetController() {
                this.user = selectedUser;
                this.items = [
                    {name: 'PHONE', icon: 'phone', icon_url: '/public/svg/phone.svg'},
                    {name: 'TWITTER', icon: 'twitter', icon_url: '/public/svg/twitter.svg'},
                    {name: 'GOOGLE+', icon: 'google_plus', icon_url: '/public/svg/google_plus.svg'},
                    {name: 'HANGOUT', icon: 'hangouts', icon_url: '/public/svg/hangouts.svg'}
                ];
                this.performAction = function(action) {
                    $mdBottomSheet.hide();
                }
            }
        }

    }]);
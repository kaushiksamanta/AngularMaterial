/**
 * Created by clicklabs on 17/5/16.
 */
App.controller('LogoutController', ['$scope', '$http','Api','$state','$timeout','$cookieStore','$loading','$mdDialog','$mdMedia','$rootScope',
    function($scope,$http,Api,$state,$timeout,$cookieStore,$loading,$mdDialog,$mdMedia,$rootScope) {
        var ask = $mdDialog.confirm()
            .title('Are You Sure You Want To Log Out ?')
            .ariaLabel('Lucky day')
            .cancel('CANCEL')
            .ok('YES');

        //$scope.tabs = {};
        //$scope.tabs.dashboard = true;
        //$scope.changecolor = function (step) {
        //    switch (step){
        //        case 'dashboard':
        //            $scope.tabs.dashboard = true;
        //            $scope.tabs.iconuser = false;
        //            $scope.tabs.Drivers = false;
        //            $scope.tabs.Invite = false;
        //            $scope.tabs.invitedcustomers = false;
        //            $scope.tabs.serviceRequests = false;
        //            $scope.tabs.Upcoming = false;
        //            $scope.tabs.Ongoing = false;
        //            $scope.tabs.Past = false;
        //            $scope.tabs.Cancelled = false;
        //            $scope.tabs.Settings = false;
        //            $state.go('app.dashboard');
        //            break;
        //        case 'iconuser':
        //            $scope.tabs.dashboard = false;
        //            $scope.tabs.iconuser = true;
        //            $scope.tabs.Drivers = false;
        //            $scope.tabs.Invite = false;
        //            $scope.tabs.invitedcustomers = false;
        //            $scope.tabs.serviceRequests = false;
        //            $scope.tabs.Upcoming = false;
        //            $scope.tabs.Ongoing = false;
        //            $scope.tabs.Past = false;
        //            $scope.tabs.Cancelled = false;
        //            $scope.tabs.Settings = false;
        //            $state.go('app.profile');
        //            break;
        //        case 'Drivers':
        //            $scope.tabs.dashboard = false;
        //            $scope.tabs.iconuser = false;
        //            $scope.tabs.Drivers = true;
        //            $scope.tabs.Invite = false;
        //            $scope.tabs.invitedcustomers = false;
        //            $scope.tabs.serviceRequests = false;
        //            $scope.tabs.Upcoming = false;
        //            $scope.tabs.Ongoing = false;
        //            $scope.tabs.Past = false;
        //            $scope.tabs.Cancelled = false;
        //            $scope.tabs.Settings = false;
        //            $state.go('app.drivers');
        //            break;
        //        case 'Invite':
        //            $scope.tabs.dashboard = false;
        //            $scope.tabs.iconuser = false;
        //            $scope.tabs.Drivers = false;
        //            $scope.tabs.Invite = true;
        //            $scope.tabs.invitedcustomers = false;
        //            $scope.tabs.serviceRequests = false;
        //            $scope.tabs.Upcoming = false;
        //            $scope.tabs.Ongoing = false;
        //            $scope.tabs.Past = false;
        //            $scope.tabs.Cancelled = false;
        //            $scope.tabs.Settings = false;
        //            $state.go('app.invite');
        //            break;
        //        case 'invitedcustomers':
        //            $scope.tabs.dashboard = false;
        //            $scope.tabs.iconuser = false;
        //            $scope.tabs.Drivers = false;
        //            $scope.tabs.Invite = false;
        //            $scope.tabs.invitedcustomers = true;
        //            $scope.tabs.serviceRequests = false;
        //            $scope.tabs.Upcoming = false;
        //            $scope.tabs.Ongoing = false;
        //            $scope.tabs.Past = false;
        //            $scope.tabs.Cancelled = false;
        //            $scope.tabs.Settings = false;
        //            $state.go('app.invitedcustomers');
        //            break;
        //        case 'serviceRequests':
        //            $scope.tabs.dashboard = false;
        //            $scope.tabs.iconuser = false;
        //            $scope.tabs.Drivers = false;
        //            $scope.tabs.Invite = false;
        //            $scope.tabs.invitedcustomers = false;
        //            $scope.tabs.serviceRequests = true;
        //            $scope.tabs.Upcoming = false;
        //            $scope.tabs.Ongoing = false;
        //            $scope.tabs.Past = false;
        //            $scope.tabs.Cancelled = false;
        //            $scope.tabs.Settings = false;
        //            $state.go('app.serviceRequests');
        //            break;
        //        case 'Upcoming':
        //            $scope.tabs.dashboard = false;
        //            $scope.tabs.iconuser = false;
        //            $scope.tabs.Drivers = false;
        //            $scope.tabs.Invite = false;
        //            $scope.tabs.invitedcustomers = false;
        //            $scope.tabs.serviceRequests = false;
        //            $scope.tabs.Upcoming = true;
        //            $scope.tabs.Ongoing = false;
        //            $scope.tabs.Past = false;
        //            $scope.tabs.Cancelled = false;
        //            $scope.tabs.Settings = false;
        //            $state.go('app.upcoming');
        //            break;
        //        case 'Ongoing':
        //            $scope.tabs.dashboard = false;
        //            $scope.tabs.iconuser = false;
        //            $scope.tabs.Drivers = false;
        //            $scope.tabs.Invite = false;
        //            $scope.tabs.invitedcustomers = false;
        //            $scope.tabs.serviceRequests = false;
        //            $scope.tabs.Upcoming = false;
        //            $scope.tabs.Ongoing = true;
        //            $scope.tabs.Past = false;
        //            $scope.tabs.Cancelled = false;
        //            $scope.tabs.Settings = false;
        //            $state.go('app.ongoing');
        //            break;
        //        case 'Past':
        //            $scope.tabs.dashboard = false;
        //            $scope.tabs.iconuser = false;
        //            $scope.tabs.Drivers = false;
        //            $scope.tabs.Invite = false;
        //            $scope.tabs.invitedcustomers = false;
        //            $scope.tabs.serviceRequests = false;
        //            $scope.tabs.Upcoming = false;
        //            $scope.tabs.Ongoing = true;
        //            $scope.tabs.Past = false;
        //            $scope.tabs.Cancelled = false;
        //            $scope.tabs.Settings = false;
        //            $state.go('app.past');
        //            break;
        //        case 'Cancelled':
        //            $scope.tabs.dashboard = false;
        //            $scope.tabs.iconuser = false;
        //            $scope.tabs.Drivers = false;
        //            $scope.tabs.Invite = false;
        //            $scope.tabs.invitedcustomers = false;
        //            $scope.tabs.serviceRequests = false;
        //            $scope.tabs.Upcoming = false;
        //            $scope.tabs.Ongoing = false;
        //            $scope.tabs.Past = false;
        //            $scope.tabs.Cancelled = true;
        //            $scope.tabs.Settings = false;
        //            $state.go('app.cancelled');
        //            break;
        //        case 'Settings':
        //            $scope.tabs.dashboard = false;
        //            $scope.tabs.iconuser = false;
        //            $scope.tabs.Drivers = false;
        //            $scope.tabs.Invite = false;
        //            $scope.tabs.invitedcustomers = false;
        //            $scope.tabs.serviceRequests = false;
        //            $scope.tabs.Upcoming = false;
        //            $scope.tabs.Ongoing = false;
        //            $scope.tabs.Past = false;
        //            $scope.tabs.Cancelled = false;
        //            $scope.tabs.Settings = true;
        //            $state.go('app.settings');
        //            break;
        //    }
        //};

        $scope.disable = false;
        $scope.logoutPopup = function(){
            $scope.disable = true;
            $mdDialog.show(ask).then(function() {
                $scope.disable = false;
                $state.go('page.login');
                logout();
            }, function() {
                $scope.disable = false;
            });
        };

        var logout = function(){
            $http
            ({
                url: Api.url + '/api/partner/logout',
                method: "PUT",
                headers: {
                    'authorization': 'bearer' + " " + $cookieStore.get('obj')
                }
            }).success(function (response) {
                $cookieStore.remove('obj');
            }).error(function (data) {
                var error = $mdDialog.confirm()
                    .title(data.message)
                    .ariaLabel('Lucky day')
                    .ok('OK');
                $mdDialog.show(error);
                $cookieStore.remove('obj');
            });

        };
    }]);

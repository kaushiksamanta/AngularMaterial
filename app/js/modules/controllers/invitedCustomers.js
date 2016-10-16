/**
 * Created by kaushik on 16/5/16.
 */
App.controller('invitedCustomersController', ['$scope', '$http','Api','$state','$timeout','$cookieStore','$mdDialog','$mdMedia','$loading','$rootScope',
    function($scope,$http,Api,$state,$timeout,$cookieStore,$mdDialog,$mdMedia,$loading,$rootScope) {

        $rootScope.changecolor('invitedcustomers');

        $loading.start('invitedCustomers');
        $scope.customFullscreen = $mdMedia('xs') || $mdMedia('sm');

        angular.element(document).ready(function(){
            angular.element('#invitedCustomersPage').css('min-height', angular.element(window).height() -55 - 60+'px');

            angular.element(window).resize(function() {
                angular.element('#invitedCustomersPage').css('min-height', angular.element(window).height() -55 - 60+'px');
            });
        });

        $scope.getAllInvitedCustomers= function(){
            $http({
                url: Api.url + '/api/partner/customers',
                method: "GET",
                headers: {
                    'authorization': 'bearer' + " " + $cookieStore.get('obj')
                }
            }).success(function (response) {
                var list = response.data;
                if(response.data == null){
                    var list = [];
                }
                var dataArray = [];
                list.forEach(function (column) {
                    var obj ={};
                    obj.id = column._id;
                    obj.countryCode = column.countryCode;
                    obj.phoneNo = column.phoneNo;
                    obj.email = column.email;
                    obj.profilePic = column.profilePicURL;
                    //obj.address = column.address;
                    obj.addedbypartner = column.addedbypartner;
                    obj.reviews = column.reviews;
                    obj.language = column.language;
                    obj.name = column.name;
                    dataArray.push(obj);
                });
                if ($.fn.DataTable.isDataTable("#invitedCustomers")) {
                    $('#invitedCustomers').DataTable().clear().destroy();
                }
                $scope.invitedCustomersList = dataArray;
                datatable();
                $loading.finish('invitedCustomers');
            }).error(function(data){
                if(data.statusCode == 401){
                    $state.go('page.login');
                    $cookieStore.remove('obj');
                    localStorage.clear();
                }
                else {
                    $loading.finish('invitedCustomers');
                    var error = $mdDialog.confirm()
                        .title(data.message)
                        .ariaLabel('Lucky day')
                        .ok('OK')
                        .cancel('CANCEL');
                    $mdDialog.show(error);
                }
            });
        };

        var datatable = function(){
            var dtInstance;
            $timeout(function(){
                if ( ! $.fn.dataTable ) return;
                dtInstance = $('#invitedCustomers').dataTable({
                    'paging':   true,  // Table pagination
                    'ordering': true,  // Column ordering
                    'info':     true,  // Bottom left status text
                    // Text translation options
                    // Note the required keywords between underscores (e.g _MENU_)
                    oLanguage: {
                        sSearch:      'Search all columns:',
                        sLengthMenu:  '_MENU_ records per page',
                        info:         'Showing page _PAGE_ of _PAGES_',
                        zeroRecords:  'Nothing found - sorry',
                        infoEmpty:    'No records available',
                        infoFiltered: '(filtered from _MAX_ total records)'
                    }
                });
            });

        };


        $scope.getAllInvitedCustomers();


        $scope.startbook = function(ev,data) {
            $scope.data = data;
            console.log(data);
            var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'))  && $scope.customFullscreen;
            $mdDialog.show({
                controller: startbookController,
                templateUrl: 'app/views/popups/invitedCustomerPopup.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose:true,
                fullscreen: useFullScreen,
                locals: { modelData: $scope.data }
            });
            $scope.$watch(function() {
                return $mdMedia('xs') || $mdMedia('sm');
            }, function(wantsFullScreen) {
                $scope.customFullscreen = (wantsFullScreen === true);
            });
        };

        function startbookController($scope, $mdDialog ,modelData,$state,$rootScope) {
            console.log(modelData);
            $scope.customerId = modelData;
            $scope.redirect = function (data) {
                switch (data){
                    case 'send':
                        $state.go("app.send",{id:$scope.customerId});
                        $scope.cancel();
                        break;
                    case 'get':
                        $state.go("app.get",{id:$scope.customerId});
                        $scope.cancel();
                        break;
                }
            };

            $scope.hide = function() {
                $mdDialog.hide();
            };
            $scope.cancel = function() {
                $mdDialog.cancel();
            };
            $scope.answer = function(answer) {
                $mdDialog.hide(answer);
            };
            $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
                $scope.cancel();
            });
            $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
                $scope.cancel();
            });
        }

        $scope.driverPic = function(ev,data) {
            $scope.profile = data;
            var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'))  && $scope.customFullscreen;
            $mdDialog.show({
                controller: driverPicController,
                templateUrl: 'app/views/popups/driverProfilePic.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose:true,
                fullscreen: useFullScreen,
                locals: { PicData: $scope.profile}
            });
            $scope.$watch(function() {
                return $mdMedia('xs') || $mdMedia('sm');
            }, function(wantsFullScreen) {
                $scope.customFullscreen = (wantsFullScreen === true);
            });
        };

        function driverPicController($scope, $mdDialog ,PicData,$rootScope) {
            $scope.picture = PicData;
            $scope.hide = function() {
                $mdDialog.hide();
            };
            $scope.cancel = function() {
                $mdDialog.cancel();
            };
            $scope.answer = function(answer) {
                $mdDialog.hide(answer);
            };
            $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
                $scope.cancel();
            });
            $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
                $scope.cancel();
            });
        };

        $scope.ConfirmDriver = function(id,data) {
            $loading.start('drivers');
            $http
            ({
                url: Api.url + '/api/partner/confirmDriver',
                method: "PUT",
                headers: {
                    'authorization': 'bearer' + " " + $cookieStore.get('obj')
                },
                data: {
                    "confirm": data ? 1:0,
                    "driver": id
                },
            }).success(function (response) {
                $loading.finish('drivers');
                var success = $mdDialog.confirm()
                    .title('Verification Status Set Successfully')
                    .ariaLabel('Lucky day')
                    .ok('OK');
                $mdDialog.show(success);
            }).error(function (data) {
                if(data.statusCode == 401){
                    $state.go('page.login');
                    $cookieStore.remove('obj');
                    localStorage.clear();
                }
                else {
                    $loading.finish('drivers');
                    var error = $mdDialog.confirm()
                        .title(data.message)
                        .ariaLabel('Lucky day')
                        .ok('OK')
                        .cancel('CANCEL');
                    $mdDialog.show(error);
                }
            });
        };

    }]);

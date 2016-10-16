/**
 * Created by kaushik on 16/5/16.
 */
App.controller('cancelledController', ['$scope', '$http','Api','$state','$timeout','$cookieStore','$mdDialog','$mdMedia','$loading','$rootScope',
    function($scope,$http,Api,$state,$timeout,$cookieStore,$mdDialog,$mdMedia,$loading,$rootScope) {
        $rootScope.changecolor('jobs');
        $loading.start('cancelled');
        $scope.customFullscreen = $mdMedia('xs') || $mdMedia('sm');

        angular.element(document).ready(function(){
            angular.element('#cancelledPage').css('min-height', angular.element(window).height() -55 - 60+'px');

            angular.element(window).resize(function() {
                angular.element('#cancelledPage').css('min-height', angular.element(window).height() -55 - 60+'px');
            });
        });

        $scope.getbookings = function(){
            $http({
                url: Api.url + '/api/partner/bookings?type=CANCELLED',
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
                    obj.onDemand = column.onDemand;
                    obj.requestSendingTime = column.requestSendingTime;
                    obj.paid = column.paid;
                    obj.paymentMethod = column.paymentMethod;
                    obj.adminNotes = column.adminNotes;
                    obj.assignedBy = column.assignedBy;
                    obj.dateModified = column.dateModified;
                    obj.dateCreated = new Date(column.dateCreated);
                    obj.bookingstatus = column.bookingstatus;
                    obj.trackingstatus = column.trackingstatus;
                    obj.deliveryaddress = column.deliveryaddress;
                    obj.pickupaddress = column.pickupaddress;
                    obj.additionalDetails = column.additionalDetails;
                    obj.estimate = column.estimate ?column.estimate :'';
                    obj.weight = column.weight;
                    obj.name = column.name;
                    obj.orderno = column.orderno;
                    obj.isComplete = column.isComplete;
                    obj.type = column.type;
                    obj.customer = column.customer;
                    obj.driver = column.driver;
                    obj.image = column.image;
                    dataArray.push(obj);
                });
                if ($.fn.DataTable.isDataTable("#cancelled")) {
                    $('#cancelled').DataTable().clear().destroy();
                }
                $scope.bookingsList = dataArray;
                datatable();
                $loading.finish('cancelled');
            }).error(function(data){
                if(data.statusCode == 401){
                    $state.go('page.login');
                    $cookieStore.remove('obj');
                    localStorage.clear();
                }
                else {
                    $loading.finish('cancelled');
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
                dtInstance = $('#cancelled').dataTable({
                    'paging':   true,  // Table pagination
                    'ordering': true,  // Column ordering
                    'info':     true,  // Bottom left status text
                    'columns':[
                        { "width": "5%" },
                        { "width": "5%" },
                        { "width": "5%" },
                        { "width": "5%" },
                        { "width": "5%" },
                        { "width": "5%" },
                        { "width": "5%" },
                        { "width": "7%" },
                        { "width": "8%" },
                        { "width": "20%" },
                        { "width": "20%" },
                        { "width": "5%" },
                        { "width": "5%" },
                        { "width": "5%" }
                    ],
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


        $scope.getbookings();



        $scope.companyDetails = function(ev,data) {
            $scope.data = data;
            var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'))  && $scope.customFullscreen;
            $mdDialog.show({
                controller: companyDetailsController,
                templateUrl: 'app/views/popups/serviceRequests.html',
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

        function companyDetailsController($scope, $mdDialog ,modelData,$rootScope) {
            $scope.modelDetails = modelData;
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

        $scope.driverDetails = function(ev,data) {
            $scope.data = data;
            var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'))  && $scope.customFullscreen;
            $mdDialog.show({
                controller: driverDetailsController,
                templateUrl: 'app/views/popups/Jobs_DriversAssigned.html',
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

        function driverDetailsController($scope, $mdDialog ,modelData,$rootScope) {
            $scope.modelDetails = modelData;
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

        $scope.parcelPic = function(ev,data) {
            $scope.profile = data;
            var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'))  && $scope.customFullscreen;
            $mdDialog.show({
                controller: parcelPicController,
                templateUrl: 'app/views/popups/ParcelImage.html',
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

        function parcelPicController($scope, $mdDialog ,PicData,$rootScope) {
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
    }]);


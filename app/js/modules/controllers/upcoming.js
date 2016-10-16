/**
 * Created by kaushik on 16/5/16.
 */
App.controller('upcomingController', ['$scope', '$http','Api','$state','$timeout','$cookieStore','$mdDialog','$mdMedia','$loading','$rootScope',
    function($scope,$http,Api,$state,$timeout,$cookieStore,$mdDialog,$mdMedia,$loading,$rootScope) {

        $rootScope.changecolor('jobs');

        $loading.start('upcoming');
        $scope.customFullscreen = $mdMedia('xs') || $mdMedia('sm');

        angular.element(document).ready(function(){
            angular.element('#upcomingPage').css('min-height', angular.element(window).height() -55 - 60+'px');

            angular.element(window).resize(function() {
                angular.element('#upcomingPage').css('min-height', angular.element(window).height() -55 - 60+'px');
            });
        });

        $scope.getbookings = function(){
            $http({
                url: Api.url + '/api/partner/bookings?type=UPCOMING',
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
                    obj.image = column.image;
                    dataArray.push(obj);
                });
                if ($.fn.DataTable.isDataTable("#upcoming")) {
                    $('#upcoming').DataTable().clear().destroy();
                }
                console.log(dataArray);
                // var dataArray1 = [];
                // for(var i=dataArray.length-1;i--;i>=0){
                //     dataArray1.push(dataArray[i]);
                // }
                // console.log(dataArray1);
                $scope.bookingsList = dataArray;
                console.log($scope.bookingsList);
                datatable();
                $loading.finish('upcoming');
            }).error(function(data){
                if(data.statusCode == 401){
                    $state.go('page.login');
                    $cookieStore.remove('obj');
                    localStorage.clear();
                }
                else {
                    $loading.finish('upcoming');
                    var error = $mdDialog.confirm()
                        .title(data.message)
                        .ariaLabel('Lucky day')
                        .ok('OK')
                        .cancel('CANCEL');
                    $mdDialog.show(error);
                }
            });
        };
        //
        var datatable = function(){
            var dtInstance;
            $timeout(function(){
                if ( ! $.fn.dataTable ) return;
                dtInstance = $('#upcoming').dataTable({
                    'paging':   true,  // Table pagination
                    'ordering': true,  // Column ordering
                    // 'order': 'desc',  // Column ordering
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
                        { "width": "7%" },
                        { "width": "7%" },
                        { "width": "8%" }
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
            // var dtInstance;
            // $timeout(function () {
            //     if (!$.fn.dataTable)
            //         return;
            //     dtInstance = $('#upcoming').dataTable({
            //         'paging': true, // Table pagination
            //         'ordering': true, // Column ordering
            //         'info': true, // Bottom left status text
            //         'bDestroy': true,
            //         // 'columns':[
            //         //                 { "width": "5%" },
            //         //                 { "width": "5%" },
            //         //                 { "width": "5%" },
            //         //                 { "width": "5%" },
            //         //                 { "width": "5%" },
            //         //                 { "width": "5%" },
            //         //                 { "width": "7%" },
            //         //                 { "width": "8%" },
            //         //                 { "width": "20%" },
            //         //                 { "width": "20%" },
            //         //                 { "width": "7%" },
            //         //                 { "width": "8%" }
            //         //             ],
            //         // Text translation options
            //         // Note the required keywords between underscores (e.g _MENU_)
            //         oLanguage: {
            //             sSearch: 'Search all columns:',
            //             sLengthMenu: '_MENU_ records per page',
            //             info: 'Showing page _PAGE_ of _PAGES_',
            //             zeroRecords: 'Nothing found - sorry',
            //             infoEmpty: 'No records available',
            //             infoFiltered: '(filtered from _MAX_ total records)'
            //         }
            //     });
            //     var inputSearchClass = 'datatable_input_col_search';
            //     var columnInputs = $('tfoot .' + inputSearchClass);
            //
            //     // On input keyup trigger filtering
            //     columnInputs.keyup(function () {
            //         dtInstance.fnFilter(this.value, columnInputs.index(this));
            //     });
            // });

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

        $scope.assignDriver = function(ev,data) {
            console.log(ev,data);
            $scope.profile = data;
            var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'))  && $scope.customFullscreen;
            $mdDialog.show({
                controller: assignDriverController,
                templateUrl: 'app/views/popups/reassignDriver.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose:true,
                fullscreen: useFullScreen,
                locals: { id: $scope.profile}
            });
            $scope.$watch(function() {
                return $mdMedia('xs') || $mdMedia('sm');
            }, function(wantsFullScreen) {
                $scope.customFullscreen = (wantsFullScreen === true);
            });
        };

        function assignDriverController($scope, $mdDialog ,id,$state,$rootScope) {
            $scope.parcelID = id;

            $scope.getAllDrivers = function(){
                $loading.start('getdrivers');
                $http({
                    url: Api.url + '/api/partner/drivers',
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
                        if(column.confirmedByPartner == true){
                            var obj ={};
                            obj.id = column._id;
                            obj.countryCode = column.countryCode;
                            obj.phoneNo = column.phoneNo;
                            obj.email = column.email;
                            obj.lastname = column.lastname;
                            obj.firstname = column.firstname;
                            dataArray.push(obj);
                        }
                    });
                    $scope.driversList = dataArray;
                    $loading.finish('getdrivers');
                }).error(function(data){
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
            $scope.getAllDrivers();

            $scope.parcelNotes = function(id,ev) {
                var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'))  && $scope.customFullscreen;
                $mdDialog.show({
                    controller: DialogController,
                    templateUrl: 'app/views/popups/parcelNotes.html',
                    parent: angular.element(document.body),
                    targetEvent: ev,
                    clickOutsideToClose:true,
                    fullscreen: useFullScreen
                });
                $scope.$watch(function() {
                    return $mdMedia('xs') || $mdMedia('sm');
                }, function(wantsFullScreen) {
                    $scope.customFullscreen = (wantsFullScreen === true);
                });
                function DialogController($scope, $mdDialog ,$state){
                    $scope.Data = [{notes:''}];
                    $scope.add = function(){
                        $scope.Data.push({notes:''});
                    };

                    $scope.NotesUpdate =function(isValid){
                        if(isValid){
                            $http
                            ({
                                url: Api.url + '/api/partner/parcelNotes',
                                method: "PUT",
                                headers: {
                                    'authorization': 'bearer' + " " + $cookieStore.get('obj')
                                },
                                data: {
                                    "parcelId":id,
                                    "adminNotes": $scope.Data
                                }
                            }).success(function (response) {
                                $scope.hide();
                                var success = $mdDialog.confirm()
                                    .title('Driver Assigned Successfully')
                                    .ariaLabel('Lucky day')
                                    .ok('OK');
                                $mdDialog.show(success).then(function(){
                                    $state.reload();
                                });
                            }).error(function (data) {
                                if(data.statusCode == 401){
                                    $state.go('page.login');
                                    $cookieStore.remove('obj');
                                    localStorage.clear();
                                }
                                else {
                                    var error = $mdDialog.confirm()
                                        .title(data.message)
                                        .ariaLabel('Lucky day')
                                        .ok('OK')
                                        .cancel('CANCEL');
                                    $mdDialog.show(error);
                                }
                            });
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
                };
            };

            $scope.assign = function (id,ev) {
                console.log(id);
                $loading.start('getdrivers');
                $http
                ({
                    url: Api.url + '/api/partner/parcel',
                    method: "PUT",
                    headers: {
                        'authorization': 'bearer' + " " + $cookieStore.get('obj')
                    },
                    data: {
                        "parcel": $scope.parcelID,
                        "driver": id
                    }
                }).success(function (response) {
                    $loading.finish('getdrivers');
                    $scope.parcelNotes($scope.parcelID,ev);
                    $state.reload();
                    //var success = $mdDialog.confirm()
                    //    .title('Driver Assigned Successfully')
                    //    .ariaLabel('Lucky day')
                    //    .ok('OK');
                    //$mdDialog.show(success).then(function($event){
                    //    $scope.parcelNotes($scope.parcelID,$event);
                    //    //$state.reload();
                    //});
                }).error(function (data) {
                    if(data.statusCode == 401){
                        $state.go('page.login');
                        $cookieStore.remove('obj');
                        localStorage.clear();
                    }
                    else {
                        $loading.finish('getdrivers');
                        var error = $mdDialog.confirm()
                            .title(data.message)
                            .ariaLabel('Lucky day')
                            .ok('OK')
                            .cancel('CANCEL');
                        $mdDialog.show(error);
                    }
                });
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
        };

    }]);

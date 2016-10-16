/**
 * Created by kaushik on 16/5/16.
 */
App.controller('reportsController', ['$scope', '$http','Api','$state','$timeout','$cookieStore','$mdDialog','$mdMedia','$loading','$rootScope',
    function($scope,$http,Api,$state,$timeout,$cookieStore,$mdDialog,$mdMedia,$loading,$rootScope) {

        $rootScope.changecolor('reports');
        $scope.add = {};
        $scope.customFullscreen = $mdMedia('xs') || $mdMedia('sm');

        angular.element(document).ready(function(){
            angular.element('#reportsPage').css('min-height', angular.element(window).height() -55 - 60+'px');

            angular.element(window).resize(function() {
                angular.element('#reportsPage').css('min-height', angular.element(window).height() -55 - 60+'px');
            });
        });

        $scope.change = function(){
            console.log($scope.add);
            $loading.start('reports');
            $http({
                url: Api.url + '/api/partner/paymentReports',
                method: "GET",
                headers: {
                    'authorization': 'bearer' + " " + $cookieStore.get('obj')
                },
                params:$scope.add
            }).success(function (response) {
                var list = response.data;
                var excelSheet = response.data;
                if(response.data == null){
                    var list = [];
                    var excelSheet = [];
                }
                var dataArray = [];
                var excelArray = [];
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
                    obj.receipt = column.pickupaddress.reciept ? column.pickupaddress.reciept : '';
                    obj.weight = column.weight;
                    obj.name = column.name;
                    obj.orderno = column.orderno;
                    obj.isComplete = column.isComplete;
                    obj.type = column.type;
                    obj.customer = column.customer;
                    //obj.driver = column.driver;
                    //obj.image = column.image;
                    obj.totalPayment = column.totalPayment;
                    dataArray.push(obj);
                });
                console.log(dataArray);
                console.log(excelSheet);
                excelSheet.forEach(function (column) {
                    var excelobj ={};
                    excelobj.Name = column.name;
                    excelobj.Orderno = column.orderno;
                    switch(column.type){
                        case "0":
                            excelobj.Type = "GET";
                            break;
                        case "1":
                            excelobj.Type = "SEND";
                            break;
                    }
                    excelobj.DateCreated = new Date(column.dateCreated);
                    switch(column.bookingstatus) {
                        case "0":
                            excelobj.BookingStatus = "PENDING";
                            break;
                        case "1":
                            excelobj.BookingStatus = "ASSIGNED";
                            break;
                        case "2":
                            excelobj.BookingStatus = "STARTED";
                            break;
                        case "3":
                            excelobj.BookingStatus = "ENROUTE";
                            break;
                        case "4":
                            excelobj.BookingStatus = "DELIVERED";
                            break;
                        case "5":
                            excelobj.BookingStatus = "COMPLETED";
                            break;
                        case "6":
                            excelobj.BookingStatus = "CANCELLED";
                            break;
                    }
                    excelobj.DeliveryAddress = column.deliveryaddress.location;
                    excelobj.PickupAddress = column.pickupaddress.location;
                    excelobj.AdditionalDetails = column.additionalDetails ? column.additionalDetails: 'N.A';
                    excelobj.Estimate = column.estimate ?column.estimate :'N.A.';
                    excelobj.Weight = column.weight;
                    excelobj.TotalPayment = column.totalPayment;
                    excelArray.push(excelobj);
                });

                $scope.ExportToExcel = excelArray;
                if ($.fn.DataTable.isDataTable("#reports")) {
                    $('#reports').DataTable().clear().destroy();
                }
                $scope.bookingsList = dataArray;
                console.log(dataArray);
                datatable();
                $loading.finish('reports');
            }).error(function(data){
                if(data.statusCode == 401){
                    $state.go('page.login');
                    $cookieStore.remove('obj');
                    localStorage.clear();
                }
                else {
                    $loading.finish('past');
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
                dtInstance = $('#reports').dataTable({
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
                        { "width": "10%" },
                        { "width": "10%" },
                        { "width": "20%" },
                        { "width": "20%" },
                        { "width": "5%" },
                        { "width": "5%" },
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


        $scope.change();

        $scope.parcelReceipt = function(ev,data) {
            $scope.receiptData = data;
            var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'))  && $scope.customFullscreen;
            $mdDialog.show({
                controller: parcelReceiptController,
                templateUrl: 'app/views/popups/parcel_receipt.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose:true,
                fullscreen: useFullScreen,
                locals: { PicData: $scope.receiptData}
            });
            $scope.$watch(function() {
                return $mdMedia('xs') || $mdMedia('sm');
            }, function(wantsFullScreen) {
                $scope.customFullscreen = (wantsFullScreen === true);
            });
        };

        function parcelReceiptController($scope, $mdDialog ,PicData,$rootScope) {
            $scope.receipt = PicData;
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

        $scope.generateCompleteReport = function(ev){
            console.log("called");
            var my_filename = 'complete report'+'.xlsx' ;
            // alasql('SELECT * INTO CSV("' + my_filename + '",{headers:true}) FROM ?', [$scope.ExportToExcel]);
                alasql('SELECT * INTO CSV("Reports.csv",{headers:true}) FROM ?',[$scope.ExportToExcel]);
        };

    }]);


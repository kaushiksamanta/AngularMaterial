/**
 * Created by Kaushik Samanta on 08-05-2016.
 */
App.controller('DashboardController', ['$scope', '$http','$state','$timeout','$rootScope','$interval','Api','$cookieStore',
    function($scope,$http,$state,$timeout,$rootScope,$interval,Api,$cookieStore) {
        $rootScope.changecolor('dashboard');

        angular.element(document).ready(function(){
            //angular.element('#scroll').css('height', angular.element(window).height() -55 -60 - 66 - 45+'px');
            angular.element('#scroll').css('height', angular.element(window).height() -55 -60 -44 -43+'px');
            angular.element('#scrollright').css('height', angular.element(window).height() -55 -60 -44 -43+'px');
            angular.element(window).resize(function() {
                //angular.element('#scroll').css('height', angular.element(window).height() -55 -60 - 66 - 45+'px');
                angular.element('#scroll').css('height', angular.element(window).height() -55 -60 -44 -43+'px');
                angular.element('#scrollright').css('height', angular.element(window).height() -55 -60 -44 -43+'px');
            });
            initMap();
        });


        $scope.map = {};
        $scope.mapArray = [];
        $scope.mapBound = {};
        $scope.mapBound = new google.maps.LatLngBounds();
        function initMap() {
            var styles = [{"featureType":"landscape","stylers":[{"hue":"#F1FF00"},{"saturation":-27.4},{"lightness":9.4},{"gamma":1}]},{"featureType":"road.highway","stylers":[{"hue":"#0099FF"},{"saturation":-20},{"lightness":36.4},{"gamma":1}]},{"featureType":"road.arterial","stylers":[{"hue":"#00FF4F"},{"saturation":0},{"lightness":0},{"gamma":1}]},{"featureType":"road.local","stylers":[{"hue":"#FFB300"},{"saturation":-38},{"lightness":11.2},{"gamma":1}]},{"featureType":"water","stylers":[{"hue":"#00B6FF"},{"saturation":4.2},{"lightness":-63.4},{"gamma":1}]},{"featureType":"poi","stylers":[{"hue":"#9FFF00"},{"saturation":0},{"lightness":0},{"gamma":1}]}];
            var styledMap = new google.maps.StyledMapType(styles,
                {name: "Styled Map"});
            $scope.map = new google.maps.Map(document.getElementById('map'), {
                zoom: 3,
                center: new google.maps.LatLng(29.3117, 47.4818),
                mapTypeControlOptions: {
                    mapTypeIds: [google.maps.MapTypeId.ROADMAP, 'map_style']
                }
            });
            $scope.map.mapTypes.set('map_style', styledMap);
            $scope.map.setMapTypeId('map_style');
            $scope.mapBound = new google.maps.LatLngBounds();
        }

        $timeout(function () {
            initMap();
        },500);


        $scope.countStatus = false;
        var load_drivers = function () {
            var a = 0;
            $http({
                url: Api.url + '/api/partner/onlinedrivers',
                method: "GET",
                headers: {
                    'authorization': 'bearer' + " " + $cookieStore.get('obj')
                }
            }).success(function(response){
                if(response.statusCode==200) {

                    var DriverDetails = [];
                    var driver = response.data.Drivers;
                    driver.forEach(function (column) {
                        if (column.confirmedByPartner == true) {
                            var d = {};
                            d.fullName = (column.firstname ? column.firstname :'') + " " + (column.lastname ? column.lastname :'');
                            d.driverImageUrl = column.profilePic.thumbnail;
                            d.email = column.email;
                            d.phoneNo = column.phoneNo;
                            d.latitude = column.currentLocation[1];
                            d.longitude = column.currentLocation[0];
                            d.id = a++;
                            DriverDetails.push(d);
                        }
                    });

                    $scope.driversInMap = DriverDetails;
                    // console.log($scope.driversInMap);
                    if($scope.driversInMap.length>0){
                        // console.log("Live Hai Bhai");
                        // console.log($scope.countStatus);
                        $scope.countStatus = true;
                        // console.log($scope.countStatus);
                        LoadMap();
                    }
                    if($scope.driversInMap.length==0 && $scope.countStatus){
                        // console.log("ud gya");
                        $scope.countStatus = false;
                        initMap();
                    }
                }
            }).error(function(data){
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
        };

        load_drivers();
        $interval(function(){
            load_drivers();
        },13000);

        //map starts here

        function extendbounds() {
            for(var m in $scope.mapArray){
                $scope.mapBound.extend($scope.mapArray[m].getPosition());
            }
            $timeout(function(){
                fitbound();
            },500);
        };

        function fitbound(){
            $scope.map.fitBounds($scope.mapBound);
        };

        function LoadMap() {
            var maprecords = $scope.driversInMap;
            if (maprecords) {
                //Create and open InfoWindow.
                $timeout(function () {
                    var infoWindow = new google.maps.InfoWindow();
                    for(var i=0;i<maprecords.length;i++){
                        if($scope.mapArray[i] === undefined){
                        }
                        else{
                            $scope.mapArray[i].setMap(null);
                        }
                    }
                    for (var i = 0; i < maprecords.length; i++) {
                        var myLatlng = new google.maps.LatLng(maprecords[i].latitude, maprecords[i].longitude);
                        $scope.mapArray[i] = new google.maps.Marker({
                            position: myLatlng,
                            map: $scope.map,
                            animation:null,
                            id: maprecords[i].id,
                            icon:'app/img/icon_location.png'
                        });
                        var marker = $scope.mapArray[i];
                        var data = maprecords[i];
                        //Attach click event to the marker.
                        (function (marker,data){
                            google.maps.event.addListener(marker, "click", function (e) {
                                //Wrap the content inside an HTML DIV in order to set height and width of InfoWindow.
                                //$scope.map.setZoom(15);
                                infoWindow.setContent('Name '+data.fullName+'<br>Phone Number '+data.phoneNo);
                                infoWindow.open($scope.map,marker);
                            });
                        })(marker,data);
                    }
                    extendbounds();
                }, 100);
            }
        };

        $scope.dropMarker = function(latitude,longitude,name,_id) {
            //if (status) {
                for(var j=0;j<$scope.mapArray.length;j++){
                    if($scope.mapArray[j].id == _id){
                        if ( $scope.mapArray[j].getAnimation() !== null) {
                            $scope.mapArray[j].setAnimation(null);
                        } else {
                            $scope.mapArray[j].setAnimation(google.maps.Animation.BOUNCE);
                        }
                    }
                }
            //}
        };

        $scope.getTasks = function(){
            $http({
                url: Api.url + '/api/partner/bookings?type=ONGOING',
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
                    obj.deliveryaddress = column.deliveryaddress.location;
                    obj.pickupaddress = column.pickupaddress.location;
                    obj.name = column.name;
                    obj.Firstletter = column.name[0].toUpperCase();
                    obj.orderno = column.orderno;
                    obj.type = column.type;
                    dataArray.push(obj);
                });
                $scope.bookingsList = dataArray;
            }).error(function(data){
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
        };

        $scope.getTasks();

    }]);

App.directive('resize', function ($window) {
    return function (scope, element,attrs) {
        var w = angular.element($window);
        scope.getWindowDimensions = function () {
            return {
                'h': w.height()
            };
        };
        scope.$watch(scope.getWindowDimensions, function (newValue, oldValue) {
            scope.windowHeight = newValue.h;
            scope.style = function () {
                return {
                    'height': (newValue.h - attrs.resize) + 'px'
                };
            };

        }, true);

        w.bind('resize', function () {
            scope.$apply();
        });
    }
});

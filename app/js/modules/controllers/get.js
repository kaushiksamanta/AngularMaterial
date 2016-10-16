/**
 * Created by kaushik on 16/5/16.
 */
App.controller('getController', ['$scope', '$http','Api','$state','$timeout','$cookieStore','$mdDialog','$mdMedia','$loading','$rootScope',
    function($scope,$http,Api,$state,$timeout,$cookieStore,$mdDialog,$mdMedia,$loading,$rootScope) {
        angular.element(document).ready(function(){
            angular.element('#getPage').css('min-height', angular.element(window).height() -55 - 60+'px');
            angular.element(window).resize(function() {
                angular.element('#getPage').css('min-height', angular.element(window).height() -55 - 60+'px');
            });
        });
        $rootScope.Getpickup={
            address:'',
            postalCode:'',
            country:'',
            exactAddress:''
        };

        $scope.getParcel = {
            Name:'',
            weight:'',
            description:'',
            additionalDetailsParcel:'',
            files:'',
            estimate:''
        };

        $scope.getReceiver = {
            ReceiverName:'',
            phone:'',
            countrycode:''
        };

        $rootScope.Getdropoff ={
            address:'',
            postalCode:'',
            country:'',
            exactAddress:'',
            additional:''
        };

        $scope.step1 = true;

        $scope.changetab = function (step) {
            switch (step){
                case 'step1':

                    $scope.step1 = true;
                    $scope.step2 = false;
                    $scope.step3 = false;
                    $scope.step4 = false;
                    break;
                case 'step2':

                    $scope.step1 = false;
                    $scope.step2 = true;
                    $scope.step3 = false;
                    $scope.step4 = false;
                    //$scope.getAllWeights();
                    break;
                case 'step3':

                    $scope.step1 = false;
                    $scope.step2 = false;
                    $scope.step3 = true;
                    $scope.step4 = false;

                    break;
                case 'step4':

                    $scope.step1 = false;
                    $scope.step2 = false;
                    $scope.step3 = false;
                    $scope.step4 = true;

                    break;
            }
        };


        //get all weights
        $scope.getAllWeights = function () {
            $http({
                url: Api.url + '/api/partner/weights',
                method: "GET",
                headers: {
                    'authorization': 'bearer' + " " + $cookieStore.get('obj')
                }
            }).success(function (response) {
                $scope.weightArray = response.data;
            }).error(function (data) {
                if(data.statusCode == 401){
                    $state.go('page.login');
                    $cookieStore.remove('obj');
                    localStorage.clear();
                }
            });
        };

        $scope.getAllWeights();

        //get fare information
        var fareInformation = JSON.parse(localStorage.getItem("fareinformation"));

        //calculate fare
        $scope.service = new google.maps.DistanceMatrixService();

        $rootScope.calculateFare = function () {
            $scope.service.getDistanceMatrix({
                origins: [$rootScope.Getpickup.address],
                destinations: [$rootScope.Getdropoff.address],
                travelMode: google.maps.TravelMode.DRIVING,
                unitSystem: google.maps.UnitSystem.METRIC,
                avoidHighways: false,
                avoidTolls: false
            }, function (response, status) {
                if (status == google.maps.DistanceMatrixStatus.OK && response.rows[0].elements[0].status != "ZERO_RESULTS") {
                    var distance = response.rows[0].elements[0].distance.text;
                    //var duration = response.rows[0].elements[0].duration.text;
                    distance = distance.split(' ')[0];
                    if(distance<fareInformation.minDistance){
                        $scope.fare = Math.round(fareInformation.baseFare);
                    }
                    else {
                        $scope.fare = Math.round(fareInformation.baseFare +(distance - fareInformation.minDistance)*fareInformation.farePerKm);
                    }
                } else {
                    alert("Unable to find the distance via road.");
                }
                $scope.$digest();
            });

        };

        $scope.file_to_upload = function (File) {
            var file = File[0];
            var imageType = /image.*/;
            if (!file.type.match(imageType)) {
                document.getElementById("registerFile").value = null;
                var error = $mdDialog.confirm()
                    .title("Please upload only image files")
                    .ariaLabel('Lucky day')
                    .ok('OK');
                $mdDialog.show(error);
                return;
            }
            else {
                $scope.FileUploaded = File[0];
            }
        };

        $scope.submit = function () {
            $loading.start('get');
            var pickup = {};
            var delivery = {};
            var formData = new FormData();
            if(typeof $rootScope.Getpickup.latlong!='undefined'){
                pickup.locationLongLat = $rootScope.Getpickup.latlong;
            }
            if($rootScope.Getpickup.address !=''){
                pickup.location = $rootScope.Getpickup.address;
            }
            else {
                $loading.finish('get');
                var success = $mdDialog.confirm()
                    .title('Please select pick up address from map')
                    .ariaLabel('Lucky day')
                    .ok('OK');
                $mdDialog.show(success).then(function() {
                    $scope.changetab('step1');
                });
                return false;
            }
            if($rootScope.Getpickup.exactAddress!=''){
                pickup.exactAddress = $rootScope.Getpickup.exactAddress;
            }
            pickup.pickupTime = new Date();

            formData.append('type',0);
            formData.append('onDemand',false);

            if($scope.getParcel.Name !=''){
                formData.append('name',$scope.getParcel.Name);
            }
            else {
                $loading.finish('get');
                var success = $mdDialog.confirm()
                    .title('Please fill parcel name')
                    .ariaLabel('Lucky day')
                    .ok('OK');
                $mdDialog.show(success).then(function() {
                    $scope.changetab('step2');
                });
                return false;
            }
            if($scope.getParcel.description !=''){
                formData.append('description',$scope.getParcel.description);
            }
            // else {
            //     $loading.finish('get');
            //     var success = $mdDialog.confirm()
            //         .title('Please fill parcel description')
            //         .ariaLabel('Lucky day')
            //         .ok('OK');
            //     $mdDialog.show(success).then(function() {
            //         $scope.changetab('step2');
            //     });
            //     return false;
            // }
            if($scope.getParcel.additionalDetailsParcel !=''){
                formData.append('additionalDetails',$scope.getParcel.additionalDetailsParcel);
            }
            // else {
            //     $loading.finish('get');
            //     var success = $mdDialog.confirm()
            //         .title('Please fill parcel additional details')
            //         .ariaLabel('Lucky day')
            //         .ok('OK');
            //     $mdDialog.show(success).then(function() {
            //         $scope.changetab('step2');
            //     });
            //     return false;
            // }
            if($scope.getParcel.weight !=''){
                formData.append('weight',$scope.getParcel.weight);
            }
            else {
                $loading.finish('get');
                var success = $mdDialog.confirm()
                    .title('Please select parcel weight')
                    .ariaLabel('Lucky day')
                    .ok('OK');
                $mdDialog.show(success).then(function() {
                    $scope.changetab('step2');
                });
                return false;
            }
            if(typeof $scope.FileUploaded!='undefined'){
                formData.append('image',$scope.FileUploaded);
            }
            if($scope.getParcel.estimate !=''){
                formData.append('estimate',$scope.getParcel.estimate);
            }
            else{
                $loading.finish('get');
                var success = $mdDialog.confirm()
                    .title('Please select parcel estimate')
                    .ariaLabel('Lucky day')
                    .ok('OK');
                $mdDialog.show(success).then(function() {
                    $scope.changetab('step2');
                });
                return false;
            }
            formData.append('customer',$state.params.id);
            if(typeof $rootScope.Getdropoff.latlong !='undefined'){
                delivery.locationLongLat = $rootScope.Getdropoff.latlong;
            }
            if($rootScope.Getdropoff.address !=''){
                delivery.location = $rootScope.Getdropoff.address;
            }
            else {
                $loading.finish('get');
                var success = $mdDialog.confirm()
                    .title('Please select drop off address from map')
                    .ariaLabel('Lucky day')
                    .ok('OK');
                $mdDialog.show(success).then(function() {
                    $scope.changetab('step4');
                });
                return false;
            }
            if($rootScope.Getdropoff.exactAddress !=''){
                delivery.exactAddress = $rootScope.Getdropoff.exactAddress;
            }
            if($scope.getReceiver.ReceiverName !=''){
                pickup.name = $scope.getReceiver.ReceiverName;
            }
            if($scope.getReceiver.phone !=''){
                pickup.phoneNo = $scope.getReceiver.phone;
            }
            delivery.fare = $scope.fare;
            if($rootScope.Getdropoff.additional !=''){
                delivery.additionalDetails = $rootScope.Getdropoff.additional;
            }
            if($scope.getReceiver.countrycode !=''){
                pickup.countryCode = '+' + $scope.getReceiver.countrycode;
            }

            $http({
                url: Api.url + '/api/partner/parcel',
                method: "POST",
                headers: {
                    'authorization': 'bearer' + " " + $cookieStore.get('obj'),
                    'Content-Type': undefined
                },
                data:formData
            }).success(function (response) {

                $http({
                    url: Api.url + '/api/partner/get/pickupDropoff',
                    method: "PUT",
                    headers: {
                        'authorization': 'bearer' + " " + $cookieStore.get('obj')
                    },
                    data:{
                        parcelId:response.data._id,
                        pickupaddress:pickup,
                        deliveryaddress:delivery
                    }
                }).success(function (response) {
                    $loading.finish('get');
                    var success = $mdDialog.confirm()
                        .title('Booking Successfully Created')
                        .ariaLabel('Lucky day')
                        .ok('OK');
                    $mdDialog.show(success).then(function() {
                        $state.go('app.invitedcustomers');
                    });
                }).error(function (error) {
                    $loading.finish('get');
                    console.log(error);
                });

                //$scope.pickupdropoff(response.data._id);
                //console.log(response);
            }).error(function(error){
                console.log(error);
            });
        };


        $scope.selectLocation = function(ev,drop) {
            $scope.drop = drop;
            var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'))  && $scope.customFullscreen;
            $mdDialog.show({
                controller: locationController,
                templateUrl: 'app/views/popups/mapsPopup.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose:true,
                fullscreen: useFullScreen,
                locals: { location: $scope.drop}
            });
            $scope.$watch(function() {
                return $mdMedia('xs') || $mdMedia('sm');
            }, function(wantsFullScreen) {
                $scope.customFullscreen = (wantsFullScreen === true);
            });
        };

        function locationController($scope, $mdDialog,$timeout,location,$rootScope) {
            $scope.location = location;
            $scope.map = {};
            $scope.fulladdress = {};
            var lat,long;
            lat = 29.3117;
            long = 47.4818;
            $scope.latlong = new google.maps.LatLng(29.3117,47.4818);

            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(success);
            } else {
                $scope.latlong = new google.maps.LatLng(29.3117,47.4818);
                lat = 29.3117;
                long = 47.4818;
            }

            function success(position) {
                $scope.latlong = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
                lat = position.coords.latitude;
                long = position.coords.longitude;
            }

            var styles = [{"featureType":"landscape","stylers":[{"hue":"#F1FF00"},{"saturation":-27.4},{"lightness":9.4},{"gamma":1}]},{"featureType":"road.highway","stylers":[{"hue":"#0099FF"},{"saturation":-20},{"lightness":36.4},{"gamma":1}]},{"featureType":"road.arterial","stylers":[{"hue":"#00FF4F"},{"saturation":0},{"lightness":0},{"gamma":1}]},{"featureType":"road.local","stylers":[{"hue":"#FFB300"},{"saturation":-38},{"lightness":11.2},{"gamma":1}]},{"featureType":"water","stylers":[{"hue":"#00B6FF"},{"saturation":4.2},{"lightness":-63.4},{"gamma":1}]},{"featureType":"poi","stylers":[{"hue":"#9FFF00"},{"saturation":0},{"lightness":0},{"gamma":1}]}];
            $timeout(function(){

                var mapOptions = {
                    zoom: 15,
                    center: $scope.latlong,
                    mapTypeId: google.maps.MapTypeId.TERRAIN,
                    styles:styles
                };

                $scope.map = new google.maps.Map(document.getElementById('googleMap'), mapOptions);
                $scope.geocoder = new google.maps.Geocoder();
                $scope.marker = new google.maps.Marker({
                    map:$scope.map,
                    draggable:true,
                    animation: google.maps.Animation.DROP,
                    position: $scope.latlong
                });


                // Create the autocomplete object, restricting the search
                // to geographical location types.
                $scope.autocomplete = new google.maps.places.Autocomplete(
                    /** @type {HTMLInputElement} */ (document.getElementById('pac-input')), {
                        types: ['geocode']
                    });
                // When the user selects an address from the dropdown,
                // populate the address fields in the form.
                google.maps.event.addListener($scope.autocomplete, 'place_changed', function () {
                    fillInAddress();
                });

                function fillInAddress() {
                    // Get the place details from the autocomplete object.
                    var place = $scope.autocomplete.getPlace();
                    $scope.marker.setMap(null);
                    $scope.map.setCenter(new google.maps.LatLng(place.geometry.location.lat(),place.geometry.location.lng()));
                    $scope.map.setZoom(15);
                    $scope.marker = new google.maps.Marker({
                        map:$scope.map,
                        draggable:true,
                        animation: google.maps.Animation.DROP,
                        position: new google.maps.LatLng(place.geometry.location.lat(),place.geometry.location.lng())
                    });

                    $scope.geocoder.geocode({'location': {lat: place.geometry.location.lat(), lng: place.geometry.location.lng()}}, addressonMap);

                    google.maps.event.addListener($scope.marker, 'dragend', function(marker, event) {
                        $scope.geocoder.geocode({'location': {lat: $scope.marker.getPosition().lat(), lng: $scope.marker.getPosition().lng()}}, formatt_address);
                    });
                }

                //geocode on initial load
                $scope.geocoder.geocode({'location': {lat: lat, lng: long}}, addressonMap);
                function addressonMap(result){
                    var address = {};
                    result[0].address_components.forEach(function (map_address) {
                        address[map_address.types[0]] = map_address.long_name;
                    });
                    $scope.fulladdress = result[0].formatted_address;
                    switch ($scope.location){
                        case "pick":
                            $rootScope.Getpickup.address = result[0].formatted_address;
                            $rootScope.Getpickup.country = address.country;
                            $rootScope.Getpickup.postalCode = address.postal_code;
                            $rootScope.Getpickup.latlong = [$scope.marker.getPosition().lng(),$scope.marker.getPosition().lat()];
                            break;
                        case "drop":
                            $rootScope.Getdropoff.address = result[0].formatted_address;
                            $rootScope.Getdropoff.country = address.country;
                            $rootScope.Getdropoff.postalCode = address.postal_code;
                            $rootScope.Getdropoff.latlong = [$scope.marker.getPosition().lng(),$scope.marker.getPosition().lat()];
                            $rootScope.calculateFare();
                            break;
                    }
                    $scope.$digest();
                }

                google.maps.event.addListener($scope.marker, 'dragstart', function() {
                    console.log("dragging");
                });
                google.maps.event.addListener($scope.marker, 'dragend', function(marker, event) {
                    $scope.geocoder.geocode({'location': {lat: $scope.marker.getPosition().lat(), lng: $scope.marker.getPosition().lng()}}, formatt_address);
                });
                //Update address fields based on dragged marker location
                function formatt_address(result) {
                    var address = {};
                    result[0].address_components.forEach(function (map_address) {
                        address[map_address.types[0]] = map_address.long_name;
                    });
                    $scope.fulladdress = result[0].formatted_address;
                    switch ($scope.location){
                        case "pick":
                            $rootScope.Getpickup.address = result[0].formatted_address;
                            $rootScope.Getpickup.country = address.country;
                            $rootScope.Getpickup.postalCode = address.postal_code;
                            $rootScope.Getpickup.latlong = [$scope.marker.getPosition().lng(),$scope.marker.getPosition().lat()];
                            break;
                        case "drop":
                            $rootScope.Getdropoff.address = result[0].formatted_address;
                            $rootScope.Getdropoff.country = address.country;
                            $rootScope.Getdropoff.postalCode = address.postal_code;
                            $rootScope.Getdropoff.latlong = [$scope.marker.getPosition().lng(),$scope.marker.getPosition().lat()];
                            $rootScope.calculateFare();
                            break;
                    }
                    $scope.$digest();
                }

            },500);


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
    }]);

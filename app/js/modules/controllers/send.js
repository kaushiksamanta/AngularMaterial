/**
 * Created by clicklabs on 30/5/16.
 */
App.controller('sendController', ['$scope', '$http','Api','$state','$timeout','$cookieStore','$mdDialog','$mdMedia','$loading','$rootScope',
    function($scope,$http,Api,$state,$timeout,$cookieStore,$mdDialog,$mdMedia,$loading,$rootScope) {
        console.log($state.params.id);
        angular.element(document).ready(function(){
            angular.element('#sendPage').css('min-height', angular.element(window).height() -55 - 60+'px');
            angular.element(window).resize(function() {
                angular.element('#sendPage').css('min-height', angular.element(window).height() -55 - 60+'px');
            });
        });

        $rootScope.Sendpickup={
            address:'',
            postalCode:'',
            country:'',
            exactAddress:''
        };

        $scope.sendParcel = {
            Name:'',
            weight:'',
            description:'',
            additionalDetailsParcel:'',
            files:''
        };

        $scope.sendReceiver = {
            ReceiverName:'',
            phone:'',
            countrycode:''
        };

        $rootScope.Senddropoff ={
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
                origins: [$rootScope.Sendpickup.address],
                destinations: [$rootScope.Senddropoff.address],
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
            $loading.start('send');
            var pickup = {};
            var delivery = {};
            var formData = new FormData();
            if(typeof $rootScope.Sendpickup.latlong!='undefined'){
                pickup.locationLongLat = $rootScope.Sendpickup.latlong;
            }
            if($rootScope.Sendpickup.address !=''){
                pickup.location = $rootScope.Sendpickup.address;
            }
            else {
                $loading.finish('send');
                var success = $mdDialog.confirm()
                    .title('Please select pick up address from map')
                    .ariaLabel('Lucky day')
                    .ok('OK');
                $mdDialog.show(success).then(function() {
                    $scope.changetab('step1');
                });
                return false;
            }
            if($rootScope.Sendpickup.exactAddress!=''){
                pickup.exactAddress = $rootScope.Sendpickup.exactAddress;
            }
            pickup.pickupTime = new Date();

            formData.append('type',1);
            formData.append('onDemand',false);

            if($scope.sendParcel.Name !=''){
                formData.append('name',$scope.sendParcel.Name);
            }
            else {
                $loading.finish('send');
                var success = $mdDialog.confirm()
                    .title('Please fill parcel name')
                    .ariaLabel('Lucky day')
                    .ok('OK');
                $mdDialog.show(success).then(function() {
                    $scope.changetab('step2');
                });
                return false;
            }
            if($scope.sendParcel.description !=''){
                formData.append('description',$scope.sendParcel.description);
            }
            // else {
            //     $loading.finish('send');
            //     var success = $mdDialog.confirm()
            //         .title('Please fill parcel description')
            //         .ariaLabel('Lucky day')
            //         .ok('OK');
            //     $mdDialog.show(success).then(function() {
            //         $scope.changetab('step2');
            //     });
            //     return false;
            // }
            if($scope.sendParcel.additionalDetailsParcel !=''){
                formData.append('additionalDetails',$scope.sendParcel.additionalDetailsParcel);
            }
            // else {
            //     $loading.finish('send');
            //     var success = $mdDialog.confirm()
            //         .title('Please fill parcel additional details')
            //         .ariaLabel('Lucky day')
            //         .ok('OK');
            //     $mdDialog.show(success).then(function() {
            //         $scope.changetab('step2');
            //     });
            //     return false;
            // }
            if($scope.sendParcel.weight !=''){
                formData.append('weight',$scope.sendParcel.weight);
            }
            else {
                $loading.finish('send');
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
            formData.append('customer',$state.params.id);
            if(typeof $rootScope.Senddropoff.latlong !='undefined'){
                delivery.locationLongLat = $rootScope.Senddropoff.latlong;
            }
            if($rootScope.Senddropoff.address !=''){
                delivery.location = $rootScope.Senddropoff.address;
            }
            else {
                $loading.finish('send');
                var success = $mdDialog.confirm()
                    .title('Please select drop off address from map')
                    .ariaLabel('Lucky day')
                    .ok('OK');
                $mdDialog.show(success).then(function() {
                    $scope.changetab('step4');
                });
                return false;
            }
            if($rootScope.Senddropoff.exactAddress !=''){
                delivery.exactAddress = $rootScope.Senddropoff.exactAddress;
            }
            if($scope.sendReceiver.ReceiverName !=''){
                delivery.name = $scope.sendReceiver.ReceiverName;
            }
            if($scope.sendReceiver.phone !=''){
                delivery.phoneNo = $scope.sendReceiver.phone;
            }
            delivery.fare = $scope.fare;
            if($rootScope.Senddropoff.additional !=''){
                delivery.additionalDetails = $rootScope.Senddropoff.additional;
            }
            if($scope.sendReceiver.countrycode !=''){
                delivery.countryCode = '+' + $scope.sendReceiver.countrycode;
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
                    url: Api.url + '/api/partner/send/pickupDropoff',
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
                    $loading.finish('send');
                    var success = $mdDialog.confirm()
                        .title('Booking Successfully Created')
                        .ariaLabel('Lucky day')
                        .ok('OK');
                    $mdDialog.show(success).then(function() {
                        $state.go('app.invitedcustomers');
                    });
                }).error(function (error) {
                    $loading.finish('send');
                    console.log(error);
                });

                //$scope.pickupdropoff(response.data._id);
                //console.log(response);
            }).error(function(error){
                console.log(error);
            });
        };


        //$scope.pickupdropoff = function (parcelId) {
        //    var pickup = {};
        //    var delivery = {};
        //    if(typeof $rootScope.Sendpickup.latlong!='undefined'){
        //        pickup.locationLongLat = $rootScope.Sendpickup.latlong;
        //    }
        //    pickup.location = $rootScope.Sendpickup.address;
        //    if(typeof $rootScope.Sendpickup.exactAddress!='undefined'){
        //        pickup.exactAddress = $rootScope.Sendpickup.exactAddress;
        //    }
        //    pickup.pickupTime = new Date();
        //    if(typeof $rootScope.Senddropoff.latlong !='undefined'){
        //        delivery.locationLongLat = $rootScope.Senddropoff.latlong;
        //    }
        //    delivery.location = $rootScope.Senddropoff.address;
        //    if($rootScope.Senddropoff.exactAddress !=''){
        //        delivery.exactAddress = $rootScope.Senddropoff.exactAddress;
        //    }
        //    if($scope.sendReceiver.ReceiverName !=''){
        //        delivery.name = $scope.sendReceiver.ReceiverName;
        //    }
        //    if($scope.sendReceiver.phone !=''){
        //        delivery.phoneNo = $scope.sendReceiver.phone;
        //    }
        //    delivery.fare = $scope.fare;
        //    if($rootScope.Senddropoff.additional !=''){
        //        delivery.additionalDetails = $rootScope.Senddropoff.additional;
        //    }
        //    if($scope.sendReceiver.countrycode !=''){
        //        delivery.countryCode = '+' + $scope.sendReceiver.countrycode;
        //    }
        //    $http({
        //        url: Api.url + '/api/partner/send/pickupDropoff',
        //        method: "PUT",
        //        headers: {
        //            'authorization': 'bearer' + " " + $cookieStore.get('obj')
        //        },
        //        data:{
        //            parcelId:parcelId,
        //            pickupaddress:pickup,
        //            deliveryaddress:delivery
        //        }
        //    }).success(function (response) {
        //        var success = $mdDialog.confirm()
        //            .title('Booking Successfully Created')
        //            .ariaLabel('Lucky day')
        //            .ok('OK');
        //        $mdDialog.show(success).then(function() {
        //            $state.go('app.invitedcustomers');
        //        });
        //    }).error(function (error) {
        //        console.log(error);
        //    });
        //};



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
                            $rootScope.Sendpickup.address = result[0].formatted_address;
                            $rootScope.Sendpickup.country = address.country;
                            $rootScope.Sendpickup.postalCode = address.postal_code;
                            $rootScope.Sendpickup.latlong = [$scope.marker.getPosition().lng(),$scope.marker.getPosition().lat()];
                            break;
                        case "drop":
                            $rootScope.Senddropoff.address = result[0].formatted_address;
                            $rootScope.Senddropoff.country = address.country;
                            $rootScope.Senddropoff.postalCode = address.postal_code;
                            $rootScope.Senddropoff.latlong = [$scope.marker.getPosition().lng(),$scope.marker.getPosition().lat()];
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
                            $rootScope.Sendpickup.address = result[0].formatted_address;
                            $rootScope.Sendpickup.country = address.country;
                            $rootScope.Sendpickup.postalCode = address.postal_code;
                            $rootScope.Sendpickup.latlong = [$scope.marker.getPosition().lng(),$scope.marker.getPosition().lat()];
                            break;
                        case "drop":
                            $rootScope.Senddropoff.address = result[0].formatted_address;
                            $rootScope.Senddropoff.country = address.country;
                            $rootScope.Senddropoff.postalCode = address.postal_code;
                            $rootScope.Senddropoff.latlong = [$scope.marker.getPosition().lng(),$scope.marker.getPosition().lat()];
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

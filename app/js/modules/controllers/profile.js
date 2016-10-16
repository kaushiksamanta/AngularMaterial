/**
 * Created by kaushik on 16/5/16.
 */
App.controller('ProfileController', ['$scope', '$http','Api','$state','$timeout','$cookieStore','$mdDialog','$mdMedia','$loading','$rootScope',
    function($scope,$http,Api,$state,$timeout,$cookieStore,$mdDialog,$mdMedia,$loading,$rootScope) {

        $rootScope.changecolor('iconuser');

        angular.element(document).ready(function(){
            angular.element('#profileForms').css('min-height', angular.element(window).height() -55 - 60+'px');

            angular.element(window).resize(function() {
                angular.element('#profileForms').css('min-height', angular.element(window).height() -55 - 60+'px');
            });
        });

        var success = $mdDialog.confirm()
            .title('Account Successfully Updated')
            .ariaLabel('Lucky day')
            .ok('OK');

        $scope.file_to_upload = function (File,name) {
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
                var img = document.getElementById(name);
                img.file = file;
                var reader = new FileReader();
                reader.onload = (function (aImg) {
                    return function (e) {
                        aImg.src = e.target.result;
                    };
                })(img);
                reader.readAsDataURL(file);
            }
        };
        $scope.profilePic = JSON.parse(localStorage.getItem("profilePic"));
        $scope.user = JSON.parse(localStorage.getItem("userDetails"));
        $scope.profileUpdate = function(isValid){
            if(isValid){
                $loading.start('profile');
                var formData = new FormData();
                formData.append('name',$scope.user.name);
                formData.append('phoneNo',$scope.user.phoneNo);
                formData.append('countryCode',"+"+$scope.user.countrycode);
                if(typeof $scope.FileUploaded != 'undefined'){
                    formData.append('profilePic',$scope.FileUploaded);
                }
                $http({
                    url: Api.url + '/api/partner/updateProfile',
                    method: "PUT",
                    headers: {
                        'authorization': 'bearer' + " " + $cookieStore.get('obj'),
                        'Content-Type': undefined
                    },
                    data:formData
                }).success(function (response) {
                    var userNewObj = {};
                    userNewObj.name = response.data.userData.name;
                    userNewObj.phoneNo = response.data.userData.phoneNo;
                    userNewObj.address = response.data.userData.address;
                    userNewObj.countrycode = response.data.userData.countryCode.replace("+", "");
                    localStorage.setItem("profilePic",JSON.stringify(response.data.userData.profilePicURL));
                    localStorage.setItem("userDetails",JSON.stringify(userNewObj));
                    $loading.finish('profile');
                    $mdDialog.show(success).then(function() {
                        $state.go('app.dashboard');
                    });
                }).error(function (data) {
                    if(data.statusCode == 401){
                        $state.go('page.login');
                        $cookieStore.remove('obj');
                        localStorage.clear();
                    }
                    else {
                        $loading.finish('profile');
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
    }]);

/**
 * Created by kaushik on 16/5/16.
 */
App.controller('RegisterController', ['$scope', '$http','Api','$state','$timeout','$cookieStore','$mdDialog','$mdMedia','$loading',
    function($scope,$http,Api,$state,$timeout,$cookieStore,$mdDialog,$mdMedia,$loading) {
        var success = $mdDialog.confirm()
            .title('Account Successfully Registered')
            .ariaLabel('Lucky day')
            .ok('OK')
            .cancel('CANCEL');
        $scope.user = {
            username:'',
            email:'',
            password:'',
            phone:'',
            countryCode:''
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

        $scope.register = function(isValid){
            if(isValid){
                $loading.start('register');
                var formData = new FormData();
                formData.append('name',$scope.user.username);
                formData.append('phoneNo',$scope.user.phone);
                formData.append('email',$scope.user.email);
                formData.append('password',$scope.user.password);
                formData.append('countryCode',"+"+$scope.user.countryCode);
                if(typeof $scope.FileUploaded != 'undefined'){
                    formData.append('profilePic',$scope.FileUploaded);
                }
                $http({
                    url: Api.url + '/api/partner/register',
                    method: "POST",
                    headers: {
                        'Content-Type': undefined
                    },
                    data:formData
                }).success(function (response) {
                    $loading.finish('register');
                    $mdDialog.show(success).then(function() {
                        $loading.finish('register');
                        $state.go('page.login');
                    }, function() {
                        $loading.finish('register');
                        $state.go('page.login');
                    });
                }).error(function (data) {
                    if(data.statusCode == 401){
                        $state.go('page.login');
                        $cookieStore.remove('obj');
                        localStorage.clear();
                    }
                    else {
                        $loading.finish('register');
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

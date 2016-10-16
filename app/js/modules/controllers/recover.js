/**
 * Created by clicklabs on 17/5/16.
 */
App.controller('RecoverController', ['$scope', '$http','Api','$state','$timeout','$cookieStore','$mdDialog','$mdMedia','$loading',
    function($scope,$http,Api,$state,$timeout,$cookieStore,$mdDialog,$mdMedia,$loading) {
        angular.element(document).ready(function(){
            angular.element('#forgot-password').css('height',angular.element(document).height()+'px');
            angular.element(window).resize(function() {
                angular.element('#forgot-password').css('height',angular.element(document).height()+'px');
            });
        });
        
        $scope.user = {
            email:'',
            password:''
        };

        $scope.recover = function(isValid){
            if(isValid){
                $loading.start('recover');
                $http({
                    url: Api.url + '/api/partner/getResetPasswordToken?'+'email='+$scope.user.email,
                    method: "GET"
                }).success(function (response) {
                    var resetToken = response.data.password_reset_token;
                    $http
                    ({
                        url: Api.url + '/api/partner/resetPassword',
                        method: "PUT",
                        data: {
                            "email": $scope.user.email,
                            "newPassword": $scope.user.password,
                            "passwordResetToken":resetToken
                        }
                    }).success(function (response) {
                        $loading.finish('recover');
                        var success = $mdDialog.confirm()
                            .title('Password Sucessfully Reset')
                            .ariaLabel('Lucky day')
                            .ok('OK');
                        $mdDialog.show(success).then(function() {
                            $state.go('page.login');
                        });
                    }).error(function (data) {
                        if(data.statusCode == 401){
                            $state.go('page.login');
                            $cookieStore.remove('obj');
                            localStorage.clear();
                        }
                        else {
                            $loading.finish('recover');
                            var error = $mdDialog.confirm()
                                .title(data.message)
                                .ariaLabel('Lucky day')
                                .ok('OK')
                                .cancel('CANCEL');
                            $mdDialog.show(error);
                        }
                    });
                }).error(function (error) {
                    if(data.statusCode == 401){
                        $state.go('page.login');
                        $cookieStore.remove('obj');
                        localStorage.clear();
                    }
                    else {
                        $loading.finish('recover');
                        var error = $mdDialog.confirm()
                            .title(data.message)
                            .ariaLabel('Lucky day')
                            .ok('OK');
                        $mdDialog.show(error);
                    }
                })
            }
        };
    }]);

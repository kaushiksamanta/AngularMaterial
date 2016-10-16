/**
 * Created by kaushik on 16/5/16.
 */
App.controller('InviteController', ['$scope', '$http','Api','$state','$timeout','$cookieStore','$mdDialog','$mdMedia','$loading','$rootScope',
    function($scope,$http,Api,$state,$timeout,$cookieStore,$mdDialog,$mdMedia,$loading,$rootScope) {

        $rootScope.changecolor('Invite');
        angular.element(document).ready(function(){
            angular.element('#invitepage').css('min-height', angular.element(window).height() -55 - 60+'px');

            angular.element(window).resize(function() {
                angular.element('#invitepage').css('min-height', angular.element(window).height() -55 - 60+'px');
            });
        });

        var success = $mdDialog.confirm()
            .title('Invitation Sent Successfully')
            .ariaLabel('Lucky day')
            .ok('OK');

        $scope.user = {
          firstname:"",
          lastname:"",
          email:"",
          countryCode:"",
          phone:""
        };

        $scope.invite = function(isValid){
            if(isValid){
                $loading.start('invite');
                var apidata = {
                    firstname:$scope.user.firstname,
                    lastname:$scope.user.lastname,
                    phoneNo:$scope.user.phone,
                    countryCode:"+" + $scope.user.countryCode
                };
                if($scope.user.email!='' && typeof $scope.user.email!='undefined'){
                    apidata.email = $scope.user.email;
                }
                $http({
                    url: Api.url + '/api/partner/customer',
                    method: "POST",
                    headers: {
                        'authorization': 'bearer' + " " + $cookieStore.get('obj')
                    },
                    data:apidata
                }).success(function (response) {

                    $loading.finish('invite');
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
                        $loading.finish('invite');
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

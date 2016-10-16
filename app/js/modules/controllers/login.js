/**
 * Created by kaushik on 16/5/16.
 */
App.controller('LoginController', ['$scope', '$http','Api','$state','$timeout','$cookieStore','$loading','$mdDialog','$mdMedia',
    function($scope,$http,Api,$state,$timeout,$cookieStore,$loading,$mdDialog,$mdMedia) {

        angular.element(document).ready(function(){
            angular.element('#login').css('height', angular.element(document).height()+'px');
            angular.element(window).resize(function() {
                angular.element('#login').css('height',angular.element(document).height()+'px');
            });
        });

        $scope.user = {
            email:'',
            password:''
        };

        $scope.login = function(isValid){
            if(isValid){
                $loading.start('login');
                $http
                ({
                    url: Api.url + '/api/partner/login',
                    method: "POST",
                    data: {
                        "email": $scope.user.email,
                        "password": $scope.user.password,
                        "flushPreviousSessions":true
                    }
                }).success(function (response) {
                    var someSessionObj = response.data.accessToken;
                    var userObj = {};
                    userObj.name = response.data.userDetails.name;
                    userObj.phoneNo = response.data.userDetails.phoneNo;
                    //userObj.address = response.data.userDetails.address;
                    userObj.countrycode = response.data.userDetails.countryCode.replace("+", "");
                    localStorage.setItem("userDetails",JSON.stringify(userObj));
                    var about = response.data.userDetails.aboutUs ? response.data.userDetails.aboutUs:'';
                    localStorage.setItem("aboutDetails",JSON.stringify(about));
                    var contact = {
                        callUs:response.data.userDetails.callUs ? response.data.userDetails.callUs:'',
                        emailUs:response.data.userDetails.emailUs ? response.data.userDetails.emailUs:'',
                        address:response.data.userDetails.address ? response.data.userDetails.address:''
                    };
                    localStorage.setItem("contactDetails",JSON.stringify(contact));
                    var faq = response.data.userDetails.FAQ ? response.data.userDetails.FAQ :[];
                    faq.forEach(function(col){
                        delete col._id;
                    });
                    localStorage.setItem("faqDetails",JSON.stringify(faq));
                    localStorage.setItem("profilePic",JSON.stringify(response.data.userDetails.profilePicURL));
                    localStorage.setItem("fareinformation",JSON.stringify(response.data.userDetails.fareInformation));
                    $cookieStore.put('obj', someSessionObj);
                    //$loading.finish('login');
                    $state.go('app.dashboard');
                }).error(function (data) {
                    $loading.finish('login');
                    var error = $mdDialog.confirm()
                        .title(data.message)
                        .ariaLabel('Lucky day')
                        .ok('OK');
                    $mdDialog.show(error);
                });
            }
        };
    }]);
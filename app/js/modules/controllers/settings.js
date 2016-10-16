/**
 * Created by kaushik on 16/5/16.
 */
App.controller('settingsController', ['$scope', '$http','Api','$state','$timeout','$cookieStore','$mdDialog','$mdMedia','$loading','$rootScope',
    function($scope,$http,Api,$state,$timeout,$cookieStore,$mdDialog,$mdMedia,$loading,$rootScope) {

        $rootScope.changecolor('Settings');
//dfdsfdsfdsf
        $loading.start('drivers');
        $scope.customFullscreen = $mdMedia('xs') || $mdMedia('sm');

        angular.element(document).ready(function(){
            angular.element('#settings').css('min-height', angular.element(window).height() -55 - 60+'px');

            angular.element(window).resize(function() {
                angular.element('#settings').css('min-height', angular.element(window).height() -55 - 60+'px');
            });
        });

        $scope.AboutUs = function(ev) {
            var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'))  && $scope.customFullscreen;
            $mdDialog.show({
                    controller: AboutUsController,
                    templateUrl: 'app/views/popups/aboutUs.html',
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
        };

        function AboutUsController($scope, $mdDialog ,$http,$rootScope) {
            $scope.aboutUsContent = JSON.parse(localStorage.getItem("aboutDetails"));
            $scope.AboutUsUpdate = function(isValid){
              if(isValid)  {
                  $http
                  ({
                      url: Api.url + '/api/partner/aboutUs',
                      method: "PUT",
                      headers: {
                          'authorization': 'bearer' + " " + $cookieStore.get('obj')
                      },
                      data: {
                          "aboutUs": $scope.aboutUsContent
                      }
                  }).success(function (response) {
                      var about = response.data.aboutUs;
                      localStorage.setItem("aboutDetails",JSON.stringify(about));
                      $scope.hide();
                      var success = $mdDialog.confirm()
                          .title('About US Content Changed Successfully')
                          .ariaLabel('Lucky day')
                          .ok('OK');
                      $mdDialog.show(success);
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
            $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
                $scope.cancel();
            });
            $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
                $scope.cancel();
            });
        }

        $scope.ContactUs = function(ev) {
            var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'))  && $scope.customFullscreen;
            $mdDialog.show({
                controller: ContactUsController,
                templateUrl: 'app/views/popups/contactUs.html',
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
        };

        function ContactUsController($scope, $mdDialog,$http,$rootScope) {
            $scope.contact = JSON.parse(localStorage.getItem("contactDetails"));
            $scope.ContactUsUpdate = function(isValid){
                if(isValid){
                  $http
                  ({
                      url: Api.url + '/api/partner/contactus',
                      method: "PUT",
                      headers: {
                          'authorization': 'bearer' + " " + $cookieStore.get('obj')
                      },
                      data: {
                          "callUs": $scope.contact.callUs,
                          "emailUs": $scope.contact.emailUs,
                          "address": $scope.contact.address
                      }
                  }).success(function (response) {
                      var contact = {
                          callUs:response.data.callUs,
                          emailUs:response.data.emailUs,
                          address:response.data.address
                      };
                      localStorage.setItem("contactDetails",JSON.stringify(contact));
                      $scope.hide();
                      var success = $mdDialog.confirm()
                          .title('Contact US Content Changed Successfully')
                          .ariaLabel('Lucky day')
                          .ok('OK');
                      $mdDialog.show(success);
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
            $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
                $scope.cancel();
            });
            $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
                $scope.cancel();
            });
        };

        $scope.faq = function(ev) {
            var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'))  && $scope.customFullscreen;
            $mdDialog.show({
                    controller: faqController,
                    templateUrl: 'app/views/popups/faq.html',
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
        };
        function faqController($scope, $mdDialog ,$http,$rootScope) {

            $scope.Data = JSON.parse(localStorage.getItem("faqDetails"));

            $scope.add = function(){
                $scope.Data.push({question:'',answer:''});
            };

            $scope.faqUpdate = function(isValid){
                if(isValid){
                    $http
                    ({
                        url: Api.url + '/api/partner/faq',
                        method: "PUT",
                        headers: {
                            'authorization': 'bearer' + " " + $cookieStore.get('obj')
                        },
                        data: {
                            "FAQ": $scope.Data
                        }
                    }).success(function (response) {
                        var faq = response.data[0].FAQ;
                        faq.forEach(function(col){
                            delete col._id;
                        });
                        localStorage.setItem("faqDetails",JSON.stringify(faq));
                        $scope.hide();
                        var success = $mdDialog.confirm()
                            .title('FAQ Content Changed Successfully')
                            .ariaLabel('Lucky day')
                            .ok('OK');
                        $mdDialog.show(success);
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
            $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
                $scope.cancel();
            });
            $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
                $scope.cancel();
            });
        }

    }]);

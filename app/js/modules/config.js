/**=========================================================
 * Module: config.js
 * App routes and resources configuration
 =========================================================*/

App.config(['$stateProvider', '$locationProvider', '$urlRouterProvider', 'RouteHelpersProvider',
function ($stateProvider, $locationProvider, $urlRouterProvider, helper) {
  'use strict';

  // Set the following to true to enable the HTML5 Mode
  // You may have to set <base> tag in index and a routing configuration in your server
  $locationProvider.html5Mode(false);

  // defaults to dashboard
  $urlRouterProvider.otherwise('/page/login');

  //
  // Application Routes
  // -----------------------------------
  $stateProvider
    .state('app', {
        url: '/app',
        abstract: true,
        templateUrl: helper.basepath('app.html'),
        controller: 'AppController',
        resolve: helper.resolveFor('fastclick', 'modernizr', 'icons', 'screenfull', 'animo', 'sparklines', 'slimscroll', 'classyloader', 'toaster', 'whirl')
    })
    .state('app.dashboard', {
        url: '/dashboard',
        title: 'Dashboard',
        controller:'DashboardController',
        templateUrl: helper.basepath('dashboard.html'),
        resolve: helper.resolveFor('flot-chart','flot-chart-plugins')
    })
    .state('app.buttons', {
        url: '/buttons',
        title: 'Buttons',
        templateUrl: helper.basepath('buttons.html')
    })
    .state('app.profile', {
        url: '/profile',
        title: 'Profile',
        templateUrl: helper.basepath('profile.html'),
        controller:'ProfileController'
    })
    .state('app.drivers', {
        url: '/drivers',
        title: 'Drivers',
        templateUrl: helper.basepath('drivers.html'),
        controller:'driversController',
        resolve: helper.resolveFor('datatables', 'datatables-pugins','slider')
    })
    .state('app.invite', {
        url: '/invite',
        title: 'Invite',
        templateUrl: helper.basepath('invite.html'),
        controller:'InviteController'
    })
    .state('app.invitedcustomers', {
        url: '/invitedcustomers',
        title: 'Invited Customers',
        templateUrl: helper.basepath('invitedCustomers.html'),
        controller:'invitedCustomersController',
        resolve: helper.resolveFor('datatables', 'datatables-pugins','slider')
    })
    .state('app.serviceRequests', {
        url: '/serviceRequests',
        title: 'Service Requests',
        templateUrl: helper.basepath('serviceRequests.html'),
        controller:'serviceRequestsController',
        resolve: helper.resolveFor('datatables', 'datatables-pugins','slider')
    })
    .state('app.send', {
        url: '/send/:id',
        title: 'Send',
        templateUrl: helper.basepath('send.html'),
        controller:'sendController',
        resolve: helper.resolveFor('parsley')
    })
    .state('app.get', {
        url: '/get/:id',
        title: 'Get',
        templateUrl: helper.basepath('get.html'),
        controller:'getController',
        resolve: helper.resolveFor('parsley')
    })
      .state('app.ongoing', {
          url: '/ongoing',
          title: 'ongoing',
          templateUrl: helper.basepath('ongoing.html'),
          controller:'ongoingController',
          resolve: helper.resolveFor('datatables', 'datatables-pugins','slider')
      })
      .state('app.upcoming', {
          url: '/upcoming',
          title: 'upcoming',
          templateUrl: helper.basepath('upcoming.html'),
          controller:'upcomingController',
          resolve: helper.resolveFor('datatables', 'datatables-pugins','slider')
      })
      .state('app.past', {
          url: '/past',
          title: 'past',
          templateUrl: helper.basepath('past.html'),
          controller:'pastController',
          resolve: helper.resolveFor('datatables', 'datatables-pugins','slider')
      })
      .state('app.cancelled', {
          url: '/cancelled',
          title: 'cancelled',
          templateUrl: helper.basepath('cancelled.html'),
          controller:'cancelledController',
          resolve: helper.resolveFor('datatables', 'datatables-pugins','slider')
      })
      .state('app.reports', {
          url: '/reports',
          title: 'Reports',
          templateUrl: helper.basepath('reports.html'),
          controller:'reportsController',
          resolve: helper.resolveFor('datatables', 'datatables-pugins','slider')
      })
    .state('app.settings', {
        url: '/settings',
        title: 'Settings',
        templateUrl: helper.basepath('settings.html'),
        controller:'settingsController'
    })

    //
    // Single Page Routes
    // -----------------------------------
    .state('page', {
        url: '/page',
        templateUrl: 'app/pages/page.html',
        resolve: helper.resolveFor('modernizr', 'icons', 'parsley'),
        controller: function($rootScope) {
            $rootScope.app.layout.isBoxed = false;
        }
    })
    .state('page.login', {
        url: '/login',
        title: "Login",
        templateUrl: 'app/pages/login.html',
        controller:'LoginController'
    })
    .state('page.register', {
        url: '/register',
        title: "Register",
        templateUrl: 'app/pages/register.html',
        controller:'RegisterController'
    })
    .state('page.recover', {
        url: '/recover',
        title: "Recover",
        templateUrl: 'app/pages/recover.html',
        controller:'RecoverController'
    })
    .state('page.lock', {
        url: '/lock',
        title: "Lock",
        templateUrl: 'app/pages/lock.html'
    })
    .state('page.404', {
        url: '/404',
        title: "Not Found",
        templateUrl: 'app/pages/404.html'
    })
    //
    // CUSTOM RESOLVES
    //   Add your own resolves properties
    //   following this object extend
    //   method
    // -----------------------------------
    // .state('app.someroute', {
    //   url: '/some_url',
    //   templateUrl: 'path_to_template.html',
    //   controller: 'someController',
    //   resolve: angular.extend(
    //     helper.resolveFor(), {
    //     // YOUR RESOLVES GO HERE
    //     }
    //   )
    // })
    ;


}]).config(['$ocLazyLoadProvider', 'APP_REQUIRES', function ($ocLazyLoadProvider, APP_REQUIRES) {
    'use strict';

    // Lazy Load modules configuration
    $ocLazyLoadProvider.config({
      debug: false,
      events: true,
      modules: APP_REQUIRES.modules
    });

}]).config(['$controllerProvider', '$compileProvider', '$filterProvider', '$provide',
    function ( $controllerProvider, $compileProvider, $filterProvider, $provide) {
      'use strict';
      // registering components after bootstrap
      App.controller = $controllerProvider.register;
      App.directive  = $compileProvider.directive;
      App.filter     = $filterProvider.register;
      App.factory    = $provide.factory;
      App.service    = $provide.service;
      App.constant   = $provide.constant;
      App.value      = $provide.value;

}]).config(['$translateProvider', function ($translateProvider) {

    $translateProvider.useStaticFilesLoader({
        prefix : 'app/i18n/',
        suffix : '.json'
    });
    $translateProvider.preferredLanguage('en');
    $translateProvider.useLocalStorage();
    $translateProvider.usePostCompiling(true);

}]).config(['tmhDynamicLocaleProvider', function (tmhDynamicLocaleProvider) {

    tmhDynamicLocaleProvider.localeLocationPattern('vendor/angular-i18n/angular-locale_{{locale}}.js');

    // tmhDynamicLocaleProvider.useStorage('$cookieStore');

}]).config(['cfpLoadingBarProvider', function(cfpLoadingBarProvider) {
    cfpLoadingBarProvider.includeBar = true;
    cfpLoadingBarProvider.includeSpinner = true;
    cfpLoadingBarProvider.latencyThreshold = 500;
    cfpLoadingBarProvider.parentSelector = '.wrapper > section';
  }])
.config(function($mdThemingProvider) {
    $mdThemingProvider.theme('default')
        .primaryPalette('teal')
        .accentPalette('blue');
});

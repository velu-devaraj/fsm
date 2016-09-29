'use strict';

/* App Module */

var fsmApp = angular.module('fsmApp', [
  'ngRoute',
  'fsmControllers'
]);

fsmApp.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/fsm', {
        templateUrl: 'fsm/partials/loader.html',
        controller: 'fsmLoaderCtrl'
      }).
      when('/fsm/:machineName', {
        templateUrl: 'fsm/partials/tables.html',
        controller: 'fsmCtrl'
      }).
      otherwise({
//        redirectTo: '/fsm'
      });
  }]);

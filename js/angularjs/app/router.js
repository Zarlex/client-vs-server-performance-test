'use strict';

angular.module('Testplatform').config(function ($routeProvider) {
  $routeProvider.when('/twitter', {
    templateUrl: '/js/angularjs/app/modules/twitter/template/twitter.html',
    controller: 'TwitterController'
  });
  $routeProvider.otherwise({redirectTo: '/twitter'});
});
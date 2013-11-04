angular.module('Testplatform',[
  'ngRoute',
  'Testplatform.Twitter',
  'Testplatform.Common'
]);

angular.module('Testplatform').config(['$httpProvider', '$provide', function ($httpProvider, $provide) {

  $provide.factory('requestInterceptor', ['$q', '$rootScope', '$log','Loading', function ($q, $rootScope, $log,Loading) {
    return {
      request: function (request) {
        Loading.register();
        return request;
      },
      responseError: function (response) {
        Loading.unregister();
        return response;
      },
      response: function(response) {
        Loading.unregister();
        // do something on success
        return response || $q.when(response);
      }
    };
  }]);
  $httpProvider.interceptors.push('requestInterceptor');
}]);
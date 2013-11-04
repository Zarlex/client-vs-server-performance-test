'use strict';
angular.module('Testplatform.Twitter').factory('Tweets', function ($http, $q) {
  return {
    all: function (limit, showProfImg) {

      var dfd = $q.defer(),
        params = {
          limit: limit || 1,
          img: showProfImg || false,
          alt: "json"
        };

      $http.get('/tweets', {params: params, transformRequest: true})
        .success(function (response) {
          dfd.resolve(response);
        })
        .error(function () {
          dfd.reject();
        });

      return dfd.promise;

    }
  };
});

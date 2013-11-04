'use strict';
angular.module('Testplatform.Twitter').controller('TwitterController',function($rootScope, $scope, Tweets) {
  Tweets.all(window.maxAmount,window.showProfImg).then(function(resp){
    $scope.startRendering=+new Date();
    $scope.tweets=resp;
  })

  $rootScope.$watch("pendingRequests",function(newValue){
    $scope.loading = newValue || false;
  })

  $scope.renderDone = function(){
    var end=+new Date() - $scope.startRendering;
    testSaver.addResult({htmlRenderedOnClient:end});
    $("#templateClientRendered").text(end+"ms");
  }
});

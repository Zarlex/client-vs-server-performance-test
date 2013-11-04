'use strict';

// Adds 'active' class to li element of sidebar if current path matches the given href in the child a
angular.module('Testplatform.Twitter').directive('tpTweetResults', function () {
  return {
    templateUrl: "/js/angularjs/app/modules/twitter/directive/templates/tweet_results.html",
    scope:{
      renderDone: "&",
      tweets:'='
    },
    link: function (scope, elm, attr) {
      scope.last = function(){
        var interval = setInterval(function(){
          var childAmount=elm.find("li").length,
              tweets = scope.tweets.$$v || scope.tweets,
              tweetAmount = tweets.length

          if(tweetAmount && tweetAmount === childAmount){
            clearInterval(interval);
            scope.renderDone();
          }
        },0)
      }
    }
  };
});

angular.module('Testplatform.Twitter').directive('tpTweet', function () {
  return {
    templateUrl: "/js/angularjs/app/modules/twitter/directive/templates/tweet.html",
    controller: function($scope){
      $scope.date = new Date($scope.tweet.created_at);
      $scope.tweet.user.profile_image = window.showProfImg?$scope.tweet.user.profile_image:"/img/default-profile.png";
    },
    link: function (scope, elm, attr) {
      if (scope.$last){
        scope.last();
      }
    }
  };
});
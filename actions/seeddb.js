/**
 * Created with JetBrains WebStorm.
 * User: zarges
 * Date: 03.07.13
 * Time: 20:16
 * To change this template use File | Settings | File Templates.
 */
var https   = require('https'),
    storage = require("../modules/storage"),
    finder  = require("../modules/finder"),
    socket  = require("../modules/socket"),
    saver   = require("../modules/saver");

exports.new = function (request, response) {
    finder.findTwitterCredentials({},function (error, credentials) {
        if(credentials){
            response.render('seeddb/new_tweet',
                { title: 'Insert new tweets',path:request.route.path}
            )
        } else {
            response.render('seeddb/new_credentials',
                { title: 'Insert new tweets',errors:null,path:request.route.path}
            )
        }
    });

    return;

};

exports.createTweet = function (request, response) {
    var params=request.body;

    finder.findTwitterCredentials({},function(err,resp){
        var credentials=new Buffer(resp.consumer_key+":"+resp.consumer_secret).toString("base64");
        getTwitterTweets(credentials,params.query,params.amount,function(tweets){
            saver.saveTweets(tweets);
        })
        response.redirect('/tweets/render');
    })

    return;

};

exports.createCredentials = function (request, response) {
    var params=request.body;
    var auth=params.consumerkey+":"+params.consumersecret
    getTwitterAccessToken(new Buffer(auth).toString("base64"),function(error,resp){
        console.log(error,resp);
        if(error){
            console.log(error)
            response.render('seeddb/new_credentials',
                { title: 'Insert new tweets',errors:error,path:request.route.path}
            )
        } else {
            saver.saveTwitterCredentials({consumer_key:params.consumerkey,consumer_secret:params.consumersecret},function(resp){
               if(resp)
                response.redirect("/seeddb");
            })
        }
    })


    return;

};

var getTwitterTweets=function(credentials,query,amount,callback){
    //MllxVDFPa3JKWHdLcDhTWnd4SEFQUTo4N3ZKbktBams4aVhGOHZLMktkZjYyZUxoblgyWnlRZ0JmRjZ3MlRlbDA=
    getTwitterAccessToken(credentials,function(error,token){
        var tweets=[];
        var steps=Math.floor(amount/100);
        var lastStep=amount%100;
        var headers = {
            'Authorization': 'Bearer '+token.access_token
        };

        var getTweetResults=function(params){
            var params=params||'?q='+query+'&count='+amount;

            var options = {
                host: 'api.twitter.com',
                port: 443,
                path: '/1.1/search/tweets.json'+params,
                method:'Get',
                headers:headers
            };

            var twitter_req=https.request(options,function(response){
                console.log(params);
                var result="";
                var tweetSeparator = "\r";
                response.setEncoding('utf8');
                response.on('data', function(chunk){
                    result += chunk;
                    var tweetSeparatorIndex = result.indexOf(tweetSeparator);
                    var didFindTweet = tweetSeparatorIndex != -1;

                    if (didFindTweet) {
                        result = result.slice(tweetSeparatorIndex + 1);
                    }
                });

                response.on('end', function(chunk){
                    steps--;
                    processResult(JSON.parse(result))
                });
            });
            twitter_req.end();
            twitter_req.on('error', function(e) {
                processResult("ERROR");
                console.error(e);
            });
        };

        var processResult=function(result){

            if(result==="ERROR"){
                console.log("THER WAS AN ERROR SO IM STOPPING FETCHING MORE TWEETS. SORRY :(");
                return;
            }

            result.statuses.forEach(function(tweet,index){
                var TweetModel={
                    created_at:+new Date(tweet.created_at),
                    _id:tweet.id,
                    text:tweet.text
                }

                var UserModel={}

                if(tweet.user){
                    UserModel={
                        name:tweet.user.name,
                        nic_name:tweet.user.screen_name,
                        location:tweet.user.location,
                        profile_image:tweet.user.profile_image_url,
                        followers:tweet.user.followers_count,
                        verified:tweet.user.verified
                    }
                }

                TweetModel.user=UserModel;
                tweets.push(TweetModel);
            });

            if(result.search_metadata.next_results && steps >= 0){
                var next=result.search_metadata.next_results;
                if(steps===0)
                    next=next.replace("&count=100","&count="+lastStep);
                console.log(steps,next);
                callback(tweets);
                tweets=[];
                getTweetResults(next);
            } else {
                console.log("FINISHED FETCHING TWEETS")
                callback(tweets)
            }
            tweets=[];
        };

        getTweetResults();
    })
}

var getTwitterAccessToken=function(authorization,callback,errback){
    var headers = {
        'Content-Type' : 'application/x-www-form-urlencoded;charset=UTF-8',
        'Authorization': 'Basic '+authorization
    };

    var options = {
        host: 'api.twitter.com',
        port: 443,
        path: '/oauth2/token',
        contentType: 'application/json',
        method:'POST',
        headers:headers
    };

    var twitter_req=https.request(options,function(response){
        var result="";
        response.on('data', function(chunk){
            result+=chunk;
        });

        response.on('end', function(){
            var token=JSON.parse(result);
            if(token.errors){
                callback(token.errors,null);
            } else {
                callback(null,token);
            }
        });
    });

    twitter_req.write("grant_type=client_credentials");
    twitter_req.end();
    twitter_req.on('error', function(e) {
        callback(e,null);
    });
}
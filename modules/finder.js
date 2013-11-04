var storage = require("../modules/storage");


exports.findTweets = function (params, limit, callback) {
    storage.mongo.collection('tweets', function (err, collection) {

        var query={};

        if(!limit){
            console.log("\n\n+++++PLEASE PASS A LIMIT PARAMETER+++++\n\n")
            callback(null,new Array());
            return;
        }
        if(params.timestamp)
            query.created_at={$gt:parseInt(params.timestamp)}
        // merge all coupons into array
        collection.find(query, {_id:1,text:1,user:1,created_at:1}, function (error, cursor) {
            cursor.limit(limit).sort( { created_at: 1 }).toArray(callback);
        });
    });
}

exports.findTests = function (params, callback) {
    storage.mongo.collection('test', function (err, collection) {
        // merge all coupons into array
        collection.find(params, function (error, cursor) {
            if(error){ console.log(error); return;}
            cursor.sort( { date: -1 }).toArray(callback);
        });
    });
}

exports.findTestResults = function (params, callback) {
    storage.mongo.collection('testResult', function (err, collection) {
        // merge all coupons into array
        collection.find(params, function (error, cursor) {
            if(error){ console.log(error); return;}
            cursor.sort( { $natural: 1 }).toArray(callback);
        });
    });
}

exports.findTwitterCredentials = function (params, callback) {
    storage.mongo.collection('credentials', function (err, collection) {
        // merge all coupons into array
        collection.findOne({}, function (error, result) {
            callback(error,result);
        });
    });
}

exports.getMillisecondsFromProcessHour = function(params){
    var s=params[0],ns=params[1];
    return s*1000 + ns/1000000;
}
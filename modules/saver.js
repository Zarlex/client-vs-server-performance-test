var storage = require("../modules/storage");

exports.saveTweets = function (query, callback) {
    storage.mongo.collection('tweets', function (err, collection) {
        collection.save(query, function (err,saved) {
            if( err || !saved ) console.log("Tweet not saved");
            else console.log("Tweet saved");
        });
    });
}

exports.createTest = function (query, callback) {
    storage.mongo.collection('test', function (err, collection) {
        collection.insert(query, function (err,saved) {
            if( err || !saved ) console.log("Test not created");
            else {
                callback(saved[0]);
            }
        });
    });
}

exports.saveTestResult = function (query, callback) {
    storage.mongo.collection('testResult', function (err, collection) {
        collection.insert(query, function (err,saved) {
            if( err || !saved ) console.log("Test not created");
            else {
                callback(saved[0]);
            }
        });
    });
}

exports.saveTwitterCredentials = function (query, callback) {
    storage.mongo.collection('credentials', function (err, collection) {
        collection.insert(query, function (err,saved) {
            if( err || !saved ) console.log("Test not created");
            else {
                callback(saved[0]);
            }
        });
    });
}
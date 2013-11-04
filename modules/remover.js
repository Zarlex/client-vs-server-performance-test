var storage = require("../modules/storage"),
    ObjectID = require('mongodb').ObjectID;


exports.removeTest = function (id, callback) {
    storage.mongo.collection('test', function (err, collection) {
        collection.remove({_id:ObjectID(id)}, function () {
            callback();
        });
    });
}

exports.removeTestResult = function (query, callback) {
    storage.mongo.collection('testResult', function (err, collection) {
        collection.remove(query, function () {
            callback();
        });
    });
}
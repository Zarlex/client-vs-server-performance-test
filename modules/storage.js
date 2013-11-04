var config                   = require("../config/config"),
    mongodb                  = require("mongodb"),
    mongo                    = new mongodb.Db(config.mongo.db, new mongodb.Server(config.mongo.host, config.mongo.port, { auto_reconnect:true }), { safe:false }),
    mongoConnectionCallbacks = [],
    mongoConnected           = false;

// Ensures that all storage connections are made
exports.open = function (callback) {
  exports.openMongo(function () {
    exports.indexMongo(function () {
      callback();
    });
  });
}

// Connects to the mongo db
exports.openMongo = function (callback) {
  
  // Just callback if already connected
  if (mongoConnected){ callback(); return; }
  
  // Add callback to list of multi-callbacks
  mongoConnectionCallbacks.push(callback);
  
  // Connect only once
  if(mongo.openCalled) return;
  mongo.open(function (error, db) {
    if (error) throw error;

    // No authentication required
    if (!config.mongo.user && !config.mongo.password) {
      mongoConnected = true;
      for (var i=0; i < mongoConnectionCallbacks.length; i++) { mongoConnectionCallbacks[i](); };
      return;
    }

    // Authenticate at mongo
    mongo.authenticate(config.mongo.user, config.mongo.password, function (error, db) {
      if (error) throw error;
      mongoConnected = true;
      for (var i=0; i < mongoConnectionCallbacks.length; i++) { mongoConnectionCallbacks[i](); };
      return;
    });
  });
}

// Sets the indices in the mongo db
exports.indexMongo = function (callback) {
  mongo.collection('coupons', function (err, collection) {
    collection.ensureIndex({ location:"2d", campaign_id:1 });
    callback();
  });
}

exports.mongo = mongo;

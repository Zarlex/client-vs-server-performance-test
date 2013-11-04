// Configuration for test environment loaded using NODE_ENV=test
// Configuration for development environment loaded using NODE_ENV=development
var development = {
  name: "development",
  host: "http://localhost:3002",
  port: 3001,
  mongo: {
    host: "localhost",
    port: 27017,
    db: "templating"
  }
};

var environments = {
  "development" : development
};

// returns the config depending on the NODE_ENV
module.exports = environments[process.env.NODE_ENV || "development"];
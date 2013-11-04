var config        = require("../config/config");
// Converts an array to a url query string
exports.toQueryString = function(params){
  return params.map(function(p){return p.join("=")}).join("&");
}
'use strict';

angular.module('Testplatform.Common').factory('Loading', function ($rootScope) {

  // TODO angular two way binding needs an array -> find a solution that the rebinding in the directive also happens for a number or rename array var test
  var _registeredLoader = 0;
  var _registerdAmount = 0;
  var test = [];

  var register = function () {
    _registeredLoader++;
    _registerdAmount++;
    test.push(1);
    $rootScope.pendingRequests = true;
    console.log("LOADING??[Service::Register]",$rootScope.pendingRequests);
  };

  var unregister = function () {

    _registeredLoader--;
    test.pop();

    if (_registeredLoader === 0) {
      $rootScope.pendingRequests = false;
      console.log("LOADING??[Service::Unregister]",$rootScope.pendingRequests);
      _registerdAmount = 0;
    }
  };

  var getRegistered = function () {
    return test;
    /*return {
     registered:_registeredLoader,
     totalRegistered : _registerdAmount
     };*/
  };

  return {
    register: register,
    unregister: unregister,
    getRegistered: getRegistered
  };
});
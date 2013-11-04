/**
 * Created with JetBrains WebStorm.
 * User: zarges
 * Date: 04.07.13
 * Time: 17:00
 * To change this template use File | Settings | File Templates.
 */

var socket = require("../modules/socket")

exports.show = function(request,response){

    response.render('index/index',
        { title: 'Start',params:request.params, path:request.route.path}
    )
}
/**
 * Created with JetBrains WebStorm.
 * User: zarges
 * Date: 03.07.13
 * Time: 20:16
 * To change this template use File | Settings | File Templates.
 */
var https   = require('https'),
    storage = require("../modules/storage")

exports.show = function (request, response) {
    //if(request.cookies.user_id==="1" && request.cookies.update==="true"){
        console.log("\n\nNEW CACHE MANIFEST\n\n")
        response.cookie('update', 'false');
        response.writeHead(200, { 'Content-Type': 'text/cache-manifest' });
        response.write(
            "CACHE MANIFEST\n" +
                "#timestamp 123391\n" +
                "\nCACHE:\n" +
                "img/default-profile.png\n" +
                "img/ajax-loader.gif\n" +
                "img/glyphicons-halflings.png\n" +
                "img/hdm_logo.png\n" +
                "img/header.jpg\n" +
                "js/jquery.1.10.2.js\n" +
                "js/underscore.1.4.4.js\n" +
                "js/app.js\n" +
                "js/app_delta_websql.js\n" +
                "js/app_delta_localstorage.js\n" +
                "js/app_delta_indexeddb.js\n" +
                "js/bootstrap.js\n" +
                "js/saveTestResult.js\n" +
                "\nNETWORK:\n" +
                "tests \n" +
                "*\n" +
                "\nFALLBACK:\n" +
                "img/user/ img/ajax-loader.gif"
        );
    /*} else if(request.cookies.update==="false"){
        console.log("\n\nNO CACHE MANIFEST\n\n")
        response.writeHead(304, { 'Content-Type': 'text/cache-manifest' });
    } else {
        console.log("\n\nDEFAULT MANIFEST\n\n")
        response.writeHead(204, { 'Content-Type': 'text/cache-manifest' });
    }*/

    response.end();


    return;

};
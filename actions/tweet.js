/**
 * Created with JetBrains WebStorm.
 * User: zarges
 * Date: 03.07.13
 * Time: 20:16
 * To change this template use File | Settings | File Templates.
 */
var https = require('https'),
  storage = require("../modules/storage"),
  finder = require("../modules/finder"),
  socket = require("../modules/socket"),
  saver = require("../modules/saver");

exports.show = function (request, response) {

  socket.resetSocket();

  var params = request.query;
  params.action = request.params.action

  var limit = parseInt(params.limit)
  var showProfImg = params.img === "false" ? false : true;

  if (params.action === "render") {
    var title2 = "Render Template", t_r = process.hrtime();

    if (params.method === "underscore") {
      response.render('tweets/client_side_underscore',
        { title: 'Tweets - Underscore Templating', maxAmount: limit, showProfImg: showProfImg, params: params, host: request.headers.host,path:request.route.path}
      )
    } else if (params.method === "js") {
      response.render('tweets/client_side',
        { title: 'Tweets - JS Templating', maxAmount: limit, showProfImg: showProfImg, params: params, host: request.headers.host,path:request.route.path}
      )
    } else if (params.method === "ng") {
      response.render('tweets/client_side_angular',
        { title: 'Tweets - Angular JS', maxAmount: limit, showProfImg: showProfImg, params: params, host: request.headers.host,path:request.route.path}
      )
    } else {
      var title1 = "Query Database", t_db = process.hrtime();
      finder.findTweets(params, limit, function (error, tweets) {
        console.log(tweets);
        var tdb_2 = process.hrtime(t_db);
        socket.sendMessage("dbProcessingTime", {time: finder.getMillisecondsFromProcessHour(tdb_2)});
        var t1 = process.hrtime(tdb_2);
        var title2 = "Render Template", t_r = process.hrtime();
        response.render('tweets/server_side',
          { title: 'Tweets', tweets: tweets, amount: tweets.length, showProfileImages: showProfImg, params: params, host: request.headers.host,path:request.route.path}
        )
        var t2 = process.hrtime(t_r);
        socket.sendMessage("htmlTemplateRenderingTime", {time: finder.getMillisecondsFromProcessHour(t2)});
        response.end();
        return;
      });
      return;
    }


    var t2 = process.hrtime(t_r);
    response.end();
    socket.sendMessage("htmlTemplateRenderingTime", {time: finder.getMillisecondsFromProcessHour(t2)});
    console.log("%s %d seconds and %d nanoseconds // %d milliseconds %d HTML (client-without-templating)", title2, t2[0], t2[1], finder.getMillisecondsFromProcessHour(t2));
    return;
  } else if (params.action === "database") {
    var title2 = "Render Template", t_r = process.hrtime();
    response.render('tweets/client_side_dbtest',
      { title: 'Tweets - JS Templating', maxAmount: limit, showProfImg: showProfImg, params: params, host: request.headers.host,path:request.route.path}
    )
    var t2 = process.hrtime(t_r);
    socket.sendMessage("htmlTemplateRenderingTime", {time: finder.getMillisecondsFromProcessHour(t2)});
    console.log("%s %d seconds and %d nanoseconds // %d milliseconds %d HTML (client-without-templating)", title2, t2[0], t2[1], finder.getMillisecondsFromProcessHour(t2));
    response.end();
    return;

  } else if (params.action === "deltaupdates") {
    var title2 = "Render Template", t_r = process.hrtime();
    response.render('tweets/client_side_delta',
      { title: 'Tweets - JS Templating', maxAmount: limit, showProfImg: showProfImg, params: params, host: request.headers.host,path:request.route.path}
    )
    var t2 = process.hrtime(t_r);
    socket.sendMessage("htmlTemplateRenderingTime", {time: finder.getMillisecondsFromProcessHour(t2)});
    console.log("%s %d seconds and %d nanoseconds // %d milliseconds %d HTML (client-without-templating)", title2, t2[0], t2[1], finder.getMillisecondsFromProcessHour(t2));
    response.end();
    return;
  }

  var title1 = "Query Database", t_db = process.hrtime();

  finder.findTweets(params, limit, function (error, tweets) {
    var tdb_2 = process.hrtime(t_db);
    socket.sendMessage("dbProcessingTime", {time: finder.getMillisecondsFromProcessHour(tdb_2)});
    var t1 = process.hrtime(tdb_2);
    var title2 = "Render Template", t_r = process.hrtime();

    if (params.alt === "json") {
      response.writeHead(200, { 'Content-Type': 'application/json', "Access-Control-Allow-Origin": '*' });
      response.write(JSON.stringify(tweets));
    }

    response.end();

    var t2 = process.hrtime(t_r);
    console.log("%s %d seconds and %d nanoseconds // %d milliseconds %d", title1, t1[0], t1[1], finder.getMillisecondsFromProcessHour(t1));
    if (params.alt === "json") {
      socket.sendMessage("jsonRenderingTime", {time: finder.getMillisecondsFromProcessHour(t2)});
      console.log("%s %d seconds and %d nanoseconds // %d milliseconds %d JSON", title2, t2[0], t2[1], finder.getMillisecondsFromProcessHour(t2));
    }
    return;
  });

  return;

};
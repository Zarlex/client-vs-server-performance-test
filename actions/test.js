/**
 * Created with JetBrains WebStorm.
 * User: zarges
 * Date: 03.07.13
 * Time: 20:16
 * To change this template use File | Settings | File Templates.
 */
var https   = require('https'),
    storage = require("../modules/storage"),
    finder  = require("../modules/finder"),
    socket  = require("../modules/socket"),
    saver   = require("../modules/saver"),
    remover   = require("../modules/remover"),
    ObjectId = require('mongodb').ObjectID,
    csv = require('csv');

exports.index = function (request, response) {
    finder.findTests({},function(error,tests){
        response.render('tests/index',
            { title: 'Insert new tweets',tests: tests,path:request.route.path}
        )
    })

}

exports.show = function(request, response){
    var id=request.params.id;
        console.log("BBBBBUUUUM")
    finder.findTestResults({test_id:id},function(error,testResults){

        var attr_names={};
        for(var attr in testResults[0]){
            attr_names[attr]=attr;
        }
        testResults.unshift(attr_names);

        parseResult(testResults,id,function(data){
            response.writeHead(200, {
                'Content-type':'text/plain'

            });
            response.write(data);
            response.end();
        })


    })

}

exports.download = function(request, response){
    var id=request.params.id
    finder.findTestResults({test_id:id},function(error,testResults){

        var attr_names={};
        for(var attr in testResults[0]){
            attr_names[attr]=attr;
        }
        testResults.unshift(attr_names);

        parseResult(testResults,id,function(data){

            finder.findTests({_id:new ObjectId(id)},function(error,testResults){
                var fileName,
                    fileType=testResults[0].name,
                    fileDate=new Date(testResults[0].date),

                    fileName=fileDate.getFullYear()+""+fileDate.getMonth()+""+fileDate.getDate()+"_"+fileType;
                    fileName=fileName.split(' ').join('_').toLowerCase();

                response.writeHead(200, {
                    'Content-Disposition':'attachment; filename='+fileName+'.csv',
                    'Content-type':'text/csv'

                });
                response.write(data);
                response.end();
            });
        })


    })

}


exports.newTest = function (request, response) {
    var params=request.body;
    params.date=+new Date();
    saver.createTest(request.body,function(result){
        response.writeHead(200, { 'Content-Type': 'application/json' });
        response.write(JSON.stringify(result));
        response.end();
    });

    return;

};

exports.saveTest = function (request, response) {
    var query=request.body;
    query.test_id=request.params.id
    saver.saveTestResult(query,function(result){
        response.writeHead(200, { 'Content-Type': 'application/json' });
        response.write(JSON.stringify(result));
        response.end();
    });

    return;

};

exports.removeTest = function (request, response) {
    var query=request.body || {};
    query.test_id=request.params.id;
    remover.removeTestResult(query,function(){
        remover.removeTest(query.test_id,function(){
            response.redirect('/tests');
        });
    })

    return;

};

var parseResult= function(testResults,id,callback){
    var attr_names={};
    for(var attr in testResults[0]){
        attr_names[attr]=attr;
    }
    csv()
        .from(testResults)
        .to( function(data){

            callback(data);

        } ).transform( function(row){
            var csv_array=[];
            for(var attr in attr_names){
                if(attr==="test_id" || attr==="_id" || attr==="dataAmount") {} else
                //if(attr==="documentSize")
                    csv_array.push(row[attr]);
            }
            csv_array.unshift(row["dataAmount"]);
            return csv_array;
        });
}
/**
 * Created with JetBrains WebStorm.
 * User: zarges
 * Date: 05.07.13
 * Time: 22:28
 * To change this template use File | Settings | File Templates.
 */

var socket;

exports.setSocketIo=function(io){
    io.sockets.on('connection', function (soc) {
        socket=soc;
        socket.on("disconnect",function(){
            socket=null;
        })
    });
}

exports.resetSocket=function(){
    socket=null;
}

exports.sendMessage=function(type,msg){
    if(socket){
        socket.emit(type, msg);
    } else {
        var self=this;
        setTimeout(function(){self.sendMessage(type,msg)},20);
    }
}

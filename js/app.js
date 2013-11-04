var Tweet=function($tweetHolder,opts){
    var opts=opts || {};
    this.$el=$tweetHolder;
    this.renderMethod=this[opts.renderMethod] || this["renderTweetWithJs"];
}

Tweet.prototype.fetch=function(params,callback){
    var tweet=this;
    params=params||{};
    params.alt="json"
    $.ajax({
        url:'/tweets',
        data:params,
        method:"GET",
        success:function(resp){callback.call(tweet,resp);}
    })
}

Tweet.prototype.addAll=function(collection,save){
    this.$el.empty();
    var start=+new Date();
    console.time("templating");

    collection.forEach(function(model){
        this.addOne(model,save);
    },this);

    var end=+new Date()-start;
    console.timeEnd("templating");
    testSaver.addResult({documentSize:JSON.getSize(collection)});
    testSaver.addResult({htmlRenderedOnClient:end});
    $("#templateClientRendered").text(end+"ms");
}

Tweet.prototype.addOne=function(model){
    this.$el.append(this.renderMethod(model));
}

Tweet.prototype.renderTweetWithJs=function(tweet){
    var date=new Date(tweet.created_at);
    return '' +
        '<li class="tweet">' +
        '<a href="http://twitter.com/'+tweet.user.nic_name+'" class="clearfix">' +
        '<h3>' +
        '<span class="user-name'+(tweet.user.verified?' verified':'')+'">'+tweet.user.name+'</span>' +
        'am ' +date.getDay()+'.'+date.getFullMonth()+' '+date.getFullYear() +
        ' um ' +date.getHours()+':'+date.getMinutes()+' Uhr' +
        '</h3>' +
        '<div class="user">' +
        '<img src="'+(showProfImg?tweet.user.profile_image:'/img/default-profile.png')+'">' +
        '<span class="user-infos">' +
        'Kommt aus '+tweet.user.location+'<br>' +
        tweet.user.followers+' follower' +
        '</span> ' +
        '</div>' +
        '<div class="text">'+tweet.text+'</div>' +
        '</a>' +
        '</li>'
}

Tweet.prototype.renderTweetWithUnderscore=function(tweet){
    tweet.showProfImg=showProfImg;
     if(typeof this.underscoreTmpl==="undefined"){
         this.underscoreTmpl=$("#tweetTemplate").html();
     }
    return _.template(this.underscoreTmpl,tweet)
}


JSON.getSize=function(str){
    if (typeof str==="object")
        str=this.stringify(str);
    var m = encodeURIComponent(str).match(/%[89ABab]/g);
    return str.length + (m ? m.length : 0);
}

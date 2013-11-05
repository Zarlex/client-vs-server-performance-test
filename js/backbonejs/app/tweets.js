/**
 * Created with JetBrains RubyMine.
 * User: zarges
 * Date: 31.10.13
 * Time: 09:57
 * To change this template use File | Settings | File Templates.
 */

/***
 *
 * MODELS
 */

var UserModel = Backbone.Model.extend({});

var TweetModel = Backbone.Model.extend({
  initialize:function(attr){
    UsersCollectionInstance.add({
      id:attr.user.nic_name,
      name:attr.user.name,
      nic_name:attr.user.nic_name,
      img:attr.user.profile_image,
      followers:attr.user.followers,
      location:attr.user.location,
      verified:attr.user.verified
    });
  },

  parse: function(attr){
    return {
      id:attr._id,
      text:attr.text,
      user:attr.user.nic_name,
      created_at: attr.created_at
    }
  }
});

/***
 *
 * COLLECTIONS
 */

var UsersCollection = Backbone.Collection.extend({
  model: UserModel,

  initialize:function(){

  }

});


var TweetsCollection = Backbone.Collection.extend({
  url: "/tweets",
  model: TweetModel,

  initialize: function(){

  }
});

var TweetsCollectionInstance = new TweetsCollection;
var UsersCollectionInstance = new UsersCollection;

/***
 *
 * VIEWS
 */

var TweetListItemView = Backbone.View.extend({
  tagName:"li",
  className:"tweet",
  initialize:function(){
    this.model.on("change",this.render,this);
  },
  render: function(){
    this.tmpl=render("/js/backbonejs/app/templates/tweet-item", {model:{
      tweet:this.model.toJSON(),
      user:UsersCollectionInstance.findWhere({id:this.model.get("user")}).toJSON()
    }});
    this.$el.html(this.tmpl);
    return this;
  }
});

var TweetListView = Backbone.View.extend({
  tagName:"ul",
  className:"tweets",
  initialize:function(attr){
      this.maxAmount=attr.maxAmount,
      this.tweetsCollection = TweetsCollectionInstance;
      this.tweetsCollection.on("reset",this.addAll,this);
      this.tweetsCollection.fetch({
        data:{limit:this.maxAmount,alt:"json"},
        reset:true
      });
  },
  addOne:function(model){
     var tweetListItemView = new TweetListItemView({model:model});
     this.$el.append(tweetListItemView.render().el);
  },
  addAll:function(collection){
    /*
     * Tweets arrived from server measure start time
     */
    var tweetsArrived = +new Date();
    collection.each(function(model,index){
      this.addOne(model);
      if(index===collection.length-1){
        /*
         * Tweets finished rendering call function to publish the test results
         */
        this._finishedRendering(tweetsArrived);
      }
    },this)
  },

  render:function(){
    return this;
  },

  /*
   * testSaver is a global variable
   * measure time from starttime to currenttime and add it to the Testsaver
   */

  _finishedRendering: function(startTime){
    var tweetsFinishedRendering=+new Date()-startTime;
    testSaver.addResult({htmlRenderedOnClient:tweetsFinishedRendering});
    $("#templateClientRendered").text(tweetsFinishedRendering+"ms");
  }
});

var TweetAppHeaderView = Backbone.View.extend({
  tagName:"h2",
  initialize:function(){
    this.tweetsCollection = TweetsCollectionInstance;
    this.tweetsCollection.on("change reset",this.render,this);
  },
  render:function(){
    var tweetAmount=this.tweetsCollection.length;
    this.tmpl=render("/js/backbonejs/app/templates/tweet-app-headline", {model:{tweetAmount:tweetAmount}});
    this.$el.html(this.tmpl);
    return this;
  }
})

var TweetAppView = Backbone.View.extend({
  el: "#tweetBB",
  className: "tweets",
  initialize:function(attr){
    this.tweetAppHeader = new TweetAppHeaderView
    this.tweetListView = new TweetListView({maxAmount:attr.maxAmount});
  },
  render:function(){
    this.tmpl=render("/js/backbonejs/app/templates/tweet-app", {});
    this.$el.html(this.tmpl);
    this.$el.append(this.tweetAppHeader.render().el);
    this.$el.append(this.tweetListView.render().el);
    return this;
  }
});
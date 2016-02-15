define([
    'backbone',
    'player/app/variable/main',
    'player/app/ui/base',
    'player/app/ui/audio'
],function(){
    player.songs.model = Backbone.Model.extend({
        defaults:{
            songName:null,
            songSize:null,
            songId:null,
            song:null
        },
        initialize:function(){
            this.setView();
            this.audioContext = player.audio.audioApi();
            //this.setCollection();
            songCollection.addInto(this);
        },
        setView:function(){
            this.iview = new player.songs.view({model:this});
        }
    });
    player.songs.view = Backbone.View.extend({
        initialize:function(){
            this.render();
        },
        render:function(){
            var that = this,
                tem = require('text!player/app/template/songs.tpl');
                t = player.base.renderT(tem,that.model.attributes.songName,'songName');
            this.setElement(t);
            $('.list_wpqsD7').append(t);
        },
        events:{
            'click .textlink_7mPpZ5':'run',
            'click .fa-toggle-right':'run',
            'click .fa-trash-o':'remove'
        },
        run:function(){
            var that = this.model;
            player.audio.serializeFile(that.attributes.song,that.audioContext);
        },
        remove:function(){
            console.log(55);
        }
    });
    player.songs.collection = Backbone.Collection.extend({
        addInto:function(opts){
            this.add(opts);
        }
    });
    var songCollection = new player.songs.collection();
});
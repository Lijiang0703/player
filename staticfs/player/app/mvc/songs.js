define([
    'backbone',
    'player/app/variable/main',
    'player/app/ui/base',
    'player/app/ui/audio'
],function(){
    player.songs.model = Backbone.Model.extend({
        defaults:{
            songName:null,
            songId:null,
            song:null,
            songElement:null,
            isnew:false,
            isrun:false,   //是否播放
            isdel:false,   //是否移除歌曲
            //showtype:null,  //显示方式
            //addtype:null   //附加方式
        },
        initialize:function(){
            this.setView();
            //this.audioContext = player.audio.audioApi();
            songCollection.addInto(this);
        },
        setView:function(){
            this.iview = new player.songs.view({model:this});
        }
    });
    player.songs.view = Backbone.View.extend({
        initialize:function(){
            this.attr = this.model.attributes;
            this.render();
            this.start();
        },
        render:function(){
            var attr = this.attr,
                tem = require('text!player/app/template/songs.tpl'),
                t = base.renderT(tem,attr.songName,'songName');
            if(attr.isnew){
                this.setElement(t);
                $('.list_wpqsD7').append(t);
            }
            else{
                this.setElement(attr.songElement);
            }
        },
        start:function(){
            var attr = this.attr;
            player.isHas = true;
            if(attr.isrun){
                var name = attr.songName,
                    t = require('text!player/app/template/run.tpl'),
                    play = base.renderT(t,context_url + name,'url');
                $('#startRun').html(play);
                $()
                play.on('play',function(){
                    player.audio.getRadio();
                });
                //player.audio.loadSong(context_url + name);
            }
            if(attr.isdel){
                this.$el.remove();  //移除该li
            }
        }
    });
    player.songs.collection = Backbone.Collection.extend({
        addInto:function(opts){
            this.add(opts);
        }
    });
    var songCollection = new player.songs.collection();
});
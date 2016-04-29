define([
    'backbone',
    'player/app/variable/main',
    'player/app/ui/base',
    'player/app/ui/audio',
    'player/app/ui/lyric'
],function(){
    player.songs.model = Backbone.Model.extend({
        defaults:{
            songName:null,
            songId:null,
            song:null,
            songElement:null,
            songurl:null,
            isnew:false,
            isrun:false,   //是否播放
            isdel:false   //是否移除歌曲
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
            var attr = this.attr;
            this.setElement(attr.songElement);
            // var attr = this.attr,
            //     tem = require('text!player/app/template/songs.tpl'),
            //     t = base.renderT(tem,{'songName':attr.songName,'songurl':attr.songUrl});
            // if(attr.isnew){
            //     this.setElement(t);
            //     $('.list_wpqsD7').append(t);
            // }
            // else{
            //     this.setElement(attr.songElement);
            // }
        },
        start:function(){
            var attr = this.attr;
            var that = this;
            var t = require('text!player/app/template/run.tpl');
            player.isHas = true;
            if(attr.isrun){
                var name = attr.songName,
                    play = base.renderT(t,attr.songUrl,'url');
                $('#startRun').html(play);
                play.on('play',function(){
                    player.audio.getRadio();
                    player.lyric.init($(that.$el).attr('id'));  // 展示歌词
                });
                play.on('ended',function(){
                    //一首播放之后自动播放下一首
                    // $(attr.songElement.parent()[0].nextSibling).find('a').click();
                    $(attr.songElement.nextSibling).find('a').click();
                });
                play.on('timeupdate',function(){
                    //播放歌词
                })
            }
            if(attr.isdel){
                //this.$el.remove();  //移除该li
                //歌曲停止播放
                var  play = base.renderT(t,'','url');
                $('#startRun').html(play);
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
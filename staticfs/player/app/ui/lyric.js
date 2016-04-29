/**
 * Created by lijiang on 16/4/27.
 */
//歌词模块,主要针对歌词的处理和播放
define([
    'player/app/variable/main'
],function(){
    player.lyric ={
        init:function () {
            var that = this;
            $.ajax({
                type:'GET',
                url:web_url+'player/app/lrc/独家记忆.lrc',
                success:function(data){
                    var lyric = that.parseLyric(data);
                    console.log(lyric);
                }
            })
        },
        parseLyric:function (lrc) {
            var lyrics = lrc.split("\n");
            var lrcObj = {};
            for(var i=0;i<lyrics.length;i++){
                var lyric = decodeURIComponent(lyrics[i]);
                var timeReg = /\[\d*:\d*((\.|\:)\d*)*\]/g;
                var timeRegExpArr = lyric.match(timeReg);
                if(!timeRegExpArr)continue;
                var clause = lyric.replace(timeReg,'');

                for(var k = 0,h = timeRegExpArr.length;k < h;k++) {
                    var t = timeRegExpArr[k];
                    var min = Number(String(t.match(/\[\d*/i)).slice(1)),
                        sec = Number(String(t.match(/\:\d*/i)).slice(1));
                    var time = min * 60 + sec;
                    lrcObj[time] = clause;
                }
            }
            return lrcObj;
        },
        render:function(){
            
        },
        run:function(){
            
        }
    };
});
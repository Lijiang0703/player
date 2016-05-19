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
                    that.render(lyric);
                    that.run(lyric);
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
        render:function(lyric){
            //渲染歌词到页面上
            $('.mylyric').find('ul').empty();
            _.each(lyric,function (v,k) {
                // if(!v) v = '&bnsp'
                $('.mylyric').find('ul').append("<li data-type='"+k+"'>"+v+'</li>');
            });
            // $('.mylyric').find('ul').append();
        },
        run:function(lyric){
            $('.audio_my').on('timeupdate',function () {
                var time = Math.round(this.currentTime);
                var t = $('.mylyric').find('ul').css('top'),
                    index;
                // console.log(time);
                // var data = lyric[time];
                $('.mylyric').find('ul .active').removeClass('active');
                $('.mylyric').find('[data-type='+time+']').addClass('active');
                index = $('.mylyric').find('[data-type='+time+']').index();
                if(index <= 1) return;
                else $('.mylyric').find('ul').css('top',parseInt(t)-15+'px');
                console.log(parseInt(t)-15+'px',time);
            })
        }
    };
});
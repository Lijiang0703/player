/**
 * Created by lijiang on 16/4/27.
 */
//歌词模块,主要针对歌词的处理和播放
define([
    'player/app/variable/main'
],function(){
    player.lyric ={
        init:function (id) {
            var that = this;
            $.ajax({
                type:'GET',
                // url:web_url+'player/app/lrc/独家记忆.lrc',
                url:'http://42.96.140.139/index.php/Test/getLrc?mid='+id,
                success:function(data){
                    var data = JSON.parse(data);
                    if( data.code== -1){
                        $('.mylyric').find('ul').empty().append('<li>无歌词</li>');
                    }
                   else {
                        $.ajax({
                            type:'GET',
                            url:data.lrcs.url,
                            success:function (data) {
                                var lyric = that.parseLyric(data);
                                // console.log(lyric);
                                that.render(lyric);
                                that.run(lyric);
                            },
                            error:function () {
                                $('.mylyric').find('ul').empty().append('<li>未找到歌词</li>');
                            }
                        });
                    }
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
                _.each($('.mylyric').find('li'),function (v) {
                    // data.push($(v).data('type'));
                    if($(v).data('type') == time){
                        $('.mylyric').find('li').removeClass('active');
                        $(v).addClass('active');
                        index = $('.mylyric').find('[data-type='+time+']').index();
                        if(index <= 1) return;
                        else {
                            $('.mylyric').find('ul').css('top',(index-1)*(-15)+'px');
                            console.log(t);
                        }
                    }
                });
                // console.log(parseInt(t)-15+'px',time);
            })
        }
    };
});
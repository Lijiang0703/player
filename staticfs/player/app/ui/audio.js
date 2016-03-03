/*
* AudioContext是一种管理、播放声音的对象。
* 要让Web Audio API播放声音或是使一个甚至更多的音频源连接到AudioContext实例上，
* 我们并不需要直接去操作该对象，而是可以通过任意数量的处理元，也就是AudioNodes来模块化地处理音频信号。
* 下面是处理音频数据的方法
* */
define([
    'player/app/variable/main',
    'player/app/ui/draw',
    'player/app/ui/base'
],function(){
    player.audio = {
        audioApi :function(){
            //audiocontext对象的兼容
            window.AudioContext = window.AudioContext || window.webkitAudioContext || window.mozAudioContext || window.msAudioContext;
            try{
                var audioContext = new AudioContext();
            }catch (e){
                console.log('not support AudioContext');
            }
            return audioContext;
        },
        navigator: function(){
            navigator.getMedia = ( navigator.getUserMedia ||
            navigator.webkitGetUserMedia ||
            navigator.mozGetUserMedia ||
            navigator.msGetUserMedia);
        },
        setlistName:function(data){
            var pre = data.split('<pre>')[1].split('</pre>')[0];
            var a =  pre.split('<a href="');
            for(var i=2;i< a.length;i++){
                var name = a[i].split('</a>')[0].split('>')[1];
                console.log(name);
                var list =  require('text!player/app/template/songs.tpl');
                var listhtml = base.renderT(list,name,'songName');
                $('.list_wpqsD7').append(listhtml);
            }
        },
        /*
        *js原生调用ajax方法
        */
        loadSong:function(url) {
            var request = new XMLHttpRequest(),that = this; //建立一个请求
            request.open('GET', url, true); //配置好请求类型，文件路径等
            request.responseType = 'arraybuffer'; //配置数据返回类型
            request.onload = function() {
                var arraybuffer = request.response;
                //解码
               audioContext.decodeAudioData(arraybuffer,function(buffer){
                    that.visualize(audioContext,buffer);
                },function(err){
                    console.log(err);
                });
            };
            request.send();
        },
        serializeFile:function(file,context){
            var that = this;
            //hmtl5文件api接口fileReader
            var fileread = new FileReader();
            //文件读取完毕
            fileread.onload=function(e){
                var result = e.target.result;  //读取arraybuffer结果存储在result中
                context.decodeAudioData(result,function(buffer){  //audioContext解码Arraybuffer
                    that.visualize(context,buffer);
                })
            };
            fileread.readAsArrayBuffer(file);   //将获取到的文件读取为Arraybuffer格式
        },
        visualize:function(context,buffer){
            /*
             * 该函数用来解析(播放)音频,在任何地方都可以调用,包括用户按键或者点击
             * */
            var sources = context.createBufferSource();  //创建声源
            //analyser = context.createAnalyser();   //获取频谱能量值的analyser节点
            sources.buffer = buffer;  //播放源
            sources.loop = false ;  //不循环播放
            sources.connect(analyser);   //声源与分析器连接
            sources.connect(context.destination);  //分析器与destination相连(到达扬声器)
            sources.start(0);     //播放
            //player.draw.drawCube(analyser);
            player.draw.draw(analyser);


            var ison = true;
            //暂停或者继续
            $('#pause').click(function(){
                if(ison){
                    //stop
                    player.audio.pause(sources);
                    ison = false;
                }
                else {
                    //play
                    player.audio.continue();
                    ison = true;
                }
            });
        },
        pause:function(source){
            /*
            * 暂停
            * */
            source.stop();

        },
        continue:function(){
            /*
            * 暂停后的继续
            * 和<audio>标签嵌入的音频文件不同，source node是不能重复播放的，所以继续功能
            * */
            //sources.play();
        }
    }
});
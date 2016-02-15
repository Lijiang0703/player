/*
* AudioContext是一种管理、播放声音的对象。
* 要让Web Audio API播放声音或是使一个甚至更多的音频源连接到AudioContext实例上，
* 我们并不需要直接去操作该对象，而是可以通过任意数量的处理元，也就是AudioNodes来模块化地处理音频信号。
* 下面是处理音频数据的方法
* */
define([
    'player/app/variable/main',
    'player/app/ui/draw'
],function(){
    player.audio = {
        audioApi :function(){
            //audiocontext对象的兼容
            window.AudioContext = window.AudioContext || window.webkitAudioContext || window.mozAudioContext || window.msAudioContext;
            window.requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.msRequestAnimationFrame;
            window.cancelAnimationFrame = window.cancelAnimationFrame || window.webkitCancelAnimationFrame || window.mozCancelAnimationFrame || window.msCancelAnimationFrame;
            try{
                var audioContext = new AudioContext();
            }catch (e){
                console.log('not support AudioContext');
            }
            return audioContext;
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
             * 该函数用来播放音频,在任何地方都可以调用,包括用户按键或者点击
             * */
            var source = context.createBufferSource(),  //创建声源
                analyser = context.createAnalyser();   //获取频谱能量值的analyser节点

            source.buffer = buffer;  //播放源
            //声源与分析器连接
            source.connect(analyser);
            //分析器与destination相连(到达扬声器)
            source.connect(context.destination);
            //播放
            //source.start(0);
            player.draw.draw3D(analyser);
        }
    }
});
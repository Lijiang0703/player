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
        navigator: function(){  //浏览器获取权限调用麦克风
            window.navigator.getMedia = ( navigator.getUserMedia ||
            navigator.webkitGetUserMedia ||
            navigator.mozGetUserMedia ||
            navigator.msGetUserMedia);
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
        /*
        *获取radio标签的资源
         *  */
        getRadio:function(){
            this.navigator();
            navigator.getMedia({audio:true},function(stream){     //success
                //var mic = audioContext.createMediaStreamSource(stream);  //调用电脑麦克风，要同意获取浏览器请求麦克风的权限
                var convolver = audioContext.createConvolver();    //创建卷积节点
                if(player.isHas){
                    var audio = $('.audio_my')[0];
                    var source = audioContext.createMediaElementSource(audio);  //获取radio标签中的source
                    //mic.connect(analyser);   //从麦克风获取媒体流，传到分析器中
                    source.connect(analyser);
                    player.isHas = false;
                }
                //analyser.connect(audioContext.destination);
                //模拟混响样本 IR(脉冲反应)  <——衰减时间\前反射的延长时间\混响声音大小等
                var length=44100;  //[3000, 192000]hz
                var buffer=audioContext.createBuffer(2,length/2,length);  //2通道,帧数
                var data=[buffer.getChannelData(0),buffer.getChannelData(1)];
                for(var i=0;i<length;i++){
                    //平方根衰减
                    var v=1-Math.sqrt(i/length);
                    //叠加24个不同频率
                    for(var j=1;j<=24;j++)v*=Math.sin(i/j);
                    //记录数据
                    data[0][i]=data[1][i]=v;
                }
                if(player.addtype == 'reverb'){    //首次设置
                    convolver.buffer = buffer;
                    analyser.connect(convolver);
                    convolver.connect(audioContext.destination);
                }
                else {
                    analyser.connect(audioContext.destination);
                }
                player.draw.draw(player.showtype);
            },function(){});
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
             * 该函数用来解析(播放)音频
             * */
            var sources = context.createBufferSource();  //创建声源
            //analyser = context.createAnalyser();   //获取频谱能量值的analyser节点
            sources.buffer = buffer;  //播放源
            sources.loop = false ;  //不循环播放
            sources.connect(analyser);   //声源与分析器连接
            sources.connect(context.destination);  //分析器与destination相连(到达扬声器)

        }
    }
});
/*
*绘制音频图
* */
define([
    'player/app/variable/main',
    'three'
],function(){
    player.draw = {
        draw2D:function(analyser){
            var canvas = document.getElementById('player_show'),
                cwidth = canvas.width,
                cheight = canvas.height - 2,
                meterWidth = 10, //频谱的宽度
                gap = 2,//频谱的间距
                capHeight = 2,
                meterNum = cwidth / (10 + 2), //频谱数量
                ctx = canvas.getContext('2d'),
                array = new Uint8Array(analyser.frequencyBinCount);
            analyser.getByteFrequencyData(array);
            var step = Math.round(array.length / meterNum);
            ctx.clearRect(0, 0, cwidth, cheight); //清理画布准备画画
//定义一个渐变样式用于画图
            gradient = ctx.createLinearGradient(0, 0, 0, 300);
            gradient.addColorStop(1, '#0f0');
            gradient.addColorStop(0.5, '#ff0');
            gradient.addColorStop(0, '#f00');
            ctx.fillStyle = gradient;
//对信源数组进行抽样遍历，画出每个频谱条
            for (var i = 0; i < meterNum; i++) {
                var value = array[i * step];
                ctx.fillRect(i * 12 /*频谱条的宽度+条间间距*/ , cheight - value + capHeight, meterWidth, cheight);
            }
        },
        draw3D:function(analyser){
            var Width = $('.container_81GpZq').width(),  //canvas width
                Height = $('.container_81GpZq').height(),  //canvas height
                spotlight = new THREE.SpotLight(), // 聚光灯
                ambientLight = new THREE.AmbientLight(),  //环境光线
                render = new THREE.WebGLRenderer(),   //渲染器
                scene = new THREE.Scene(),   //场景
                camera = new THREE.Camera()  //照相机
                ;

            render.shadowMapEnabled = true   //渲染器渲染阴影

            render.setClearColor(0x212121); //background
            render.setSize(Width,Height);
            $('.container_81GpZq').append(render.domElement);
        }
    }
});
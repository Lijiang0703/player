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
                ambientLight = new THREE.AmbientLight(0xffffff),  //环境光线
                render = new THREE.WebGLRenderer(),   //渲染器
                scene = new THREE.Scene(),   //场景
                camera = new THREE.Camera(),  //照相机
                ground = new THREE.Mesh(new THREE.PlaneGeometry(Width,Height),new THREE.MeshLambertMaterial({
                    color:0x000000
                }))  //建立场地
                ;

            render.shadowMapEnabled = true;   //渲染器渲染阴影
            camera.position.set(0,0,5);
            scene.add(camera);

            spotlight.shadowCameraVisible = true;  //调试看到阴影照相机的位置
            spotlight.castShadow = true;   //产生阴影
            spotlight.shadowCameraFar = 2;
            spotlight.shadowCameraNear = 10;
            spotlight.shadowCameraFov = 30;    // 张角
            spotlight.shadowDarkness = 0.5;   //阴影的深浅
            spotlight.position.set(0,10,0);

            render.setClearColor(0x212121); //background
            render.setSize(Width,Height);
            $('.container_81GpZq').append(render.domElement);
            //建立柱形
            var cubegeometry = new THREE.CubeGeometry(1,2,3),
                cubematerial = new  THREE.MeshLambertMaterial({
                    color:0xffff00
                });
            var cube = new THREE.Mesh(cubegeometry,cubematerial);
            //建立白帽子
            var upgeometry = new THREE.CubeGeometry(1,2,1),
                upmaterial = new THREE.MeshLambertMaterial({
                    color:0xffffff
                });
            scene.add(cube);

            render.render(scene,camera);
        },
        animate:function(){},
        render:function(){},
        update:function(){}
    }
});
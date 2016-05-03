/*
*绘制音频图
* */
define([
    'player/app/variable/main',
    'three',
    'OrbitControls',
    'underscore'
],function(){
    player.draw = {
        draw:function(type){
            var canvas = document.createElement('canvas');
            canvas.width = $('#myshow').width();
            canvas.height = $('#myshow').height();
            $('#myshow').html(canvas);

            this.WIDTH = canvas.width;
            this.HEIGHT = canvas.height;
            //this.context = canvas.getContext('2d');    //获取canvas的上下文对象
            this.canvas = canvas;
            switch (type){
                case 'line': this.Waveform(); break;
                case 'point':this.Arc();break;
                case '2cube':this.Cube();break;
                case '3cube':this._draw();break;
            }
        },
        Cube3d:function(){
            //长度相对2d的有40倍左右...差不多
            analyser.fftSize = 128;
            var length = analyser.frequencyBinCount;       //128/2 = 64
            var array = new Uint8Array(length);
            var WIDTH = canvas.width,
                HEIGHT = canvas.height,
                DEPTH = 0.5,  //z
                cube_wid =  Math.ceil(WIDTH*0.88/64-3);  //每个频域的长度
            var scene = new THREE.Scene();
            var camera = new THREE.PerspectiveCamera( 45, WIDTH / HEIGHT, 0.1, 1000);  //角度,比例,near,far

            var renderer = new THREE.WebGLRenderer({
                canvas:canvas
            });
            //var plane = new THREE.PlaneGeometry(width, height, widthSegments, heightSegments)
            var material = new THREE.MeshBasicMaterial( { color: 0x00ff00,
                wireframe: true } );

            var spotLight = new THREE.SpotLight(0xffffff);  //聚光灯
            spotLight.position.set( 100, 100, 100 );
            spotLight.castShadow = true;
            spotLight.shadowMapWidth = 1024;
            spotLight.shadowMapHeight = 1024;
            spotLight.shadowCameraNear = 500;
            spotLight.shadowCameraFar = 4000;
            spotLight.shadowCameraFov = 30;
            scene.add( spotLight );

            //camera.position.set( 0,0,5);
            //camera.lookAt(new THREE.Vector3(0,0,0));
            camera.position.set(4,-3,5);
            camera.lookAt(new THREE.Vector3(0,0,0));
            var render = function () {
                requestAnimationFrame(render);
                analyser.getByteFrequencyData(array);
                var x = WIDTH*0.06/40;    //起始x
                for(var i=0 ;i<length;i++){
                    var geometry = new THREE.CubeGeometry( cube_wid/40, array[i]/256 *0.6*HEIGHT/40, DEPTH );
                    //var geometry = new THREE.CubeGeometry( 1, 1, 1 );
                    var mesh = new THREE.Mesh( geometry, material );
                    //x = cube_wid+3;
                    mesh.position.set(x/40,0,0);
                    x += cube_wid/40 + 0.5;
                    scene.add( mesh );
                }
                renderer.render(scene, camera);
            };
            render();

        },
        Cube3D:function(){
            //准备
            var that = this;
            var GAP = 2,    //间隔
                cube_depth = 1,
                MWidth = 2, //长度
                LENGTH = Math.round(100/(MWidth+GAP));
            var scene = new THREE.Scene(),
                render = new THREE.WebGLRenderer({
                    canvas:that.canvas,
                    antialias:true
                }),
                camera = new THREE.PerspectiveCamera(45,that.WIDTH/that.HEIGHT,0,1,1000),
                spolight = new THREE.SpotLight(0xffffff),
                ambientLight = new THREE.AmbientLight(0x0c0c0c),
                orbitControl = new THREE.OrbitControls(camera),
                clock = new THREE.Clock(),
                planeGeometry,planeMetrial,plane;

            //镜头拖动
            orbitControl.minDistance = 50;
            orbitControl.maxDistance = 200;
            orbitControl.maxPolarAngle =1.5;
            orbitControl.noPan = true;
            //渲染器
            render.setClearColor(0x212121);
            render.shadowMapEnabled = true;
            //底部平面
            planeGeometry =  new THREE.PlaneGeometry(500,500);
            planeMetrial = new THREE.MeshPhongMaterial({
                color:0x222222,
                ambient:0x555555,
                specular:0xdddddd,
                shininess:5,
                reflectivity:2
            });
            planeMetrial.side = THREE.DoubleSide;
            plane = new THREE.Mesh(planeGeometry,planeMetrial);
            plane.rotation.x = -0.5*Math.PI;
            plane.position.set(15,0,0);
            plane.receiveShadow = true;
            scene.add(plane);
            //柱体
            var cubeGeometry = new THREE.CubeGeometry(MWidth,1,cube_depth);
            var cubeMaterial = new THREE.MeshPhongMaterial({
                color:0x01ff00,
                ambient:0x01ff00,
                specilar:0x01ff00,
                shininess:20,
                reflectivity:5.5
            });
            //顶部小方块
            var capGeometry = new THREE.CubeGeometry(MWidth,0.5,cube_depth);
            var capMaterial = new THREE.MeshPhongMaterial({
                color:0xffffff,
                ambient:0x01ff00,
                specilar:0x01ff00,
                shininess:20,
                reflectivity:5.5
            });
            for(var i =LENGTH-1;i>=0;i--){
                var cube =  new THREE.Mesh(cubeGeometry,cubeMaterial);
                //cube.set(-45+MWidth
                cube.position.x = -45 +(MWidth+GAP)*i;
                cube.position.y = 1;
                cube.position.z = 0.5;
                cube.castShadow = true;
                cube.name = 'cube'+i;
                scene.add(cube);
                var cap = new THREE.Mesh(capGeometry,capMaterial);
                cap.position.x = -45+(MWidth+GAP)*i;
                cap.position.y = 0.5;
                cap.position.z = 0.5;
                cap.castShadow = true;
                cap.name = 'cap'+i;
                scene.add(cap);
            }
            //照相机
            camera.position.set(0,10,100);
            camera.lookAt(scene.position);

            scene.add(ambientLight);

            spolight.position.set(0,60,40);
            spolight.shadowCameraVisible = true;
            scene.add(spolight);

            var directionalLight = new THREE.DirectionalLight(0xffffff,0.7);
            directionalLight.castShadow = true;
            directionalLight.position.set(0,10,10);
            scene.add(directionalLight);
            render.render(scene,camera);
            this.LENGTH = LENGTH;
            this.scene = scene;
            this.render = render;
            this.camera = camera;
            this.orbitControls = orbitControl;
            this.clock = clock;
        },
        _draw:function(){
            this.Cube3D();
            var that =  this;
            var animate = function(){
                window.requestAnimationFrame(animate);
                var delta = that.clock.getDelta();
                that.orbitControls.update(delta);
                if(analyser){
                    var array = new Uint8Array(analyser.frequencyBinCount);
                    analyser.getByteFrequencyData(array);
                    var step = Math.round(array.length / that.LENGTH );  //取值间隔
                    for(var i = 0 ;i<that.LENGTH;i++){
                        var value = array[i*step] /4;
                        value = value<1 ? 1:value;
                        var meter = that.scene.getObjectByName('cube'+i ,true),
                            cap = that.scene.getObjectByName('cap'+i ,true);
                        meter.scale.y = value;
                        meter.geometry.computeBoundingBox();
                        height = (meter.geometry.boundingBox.max.y - meter.geometry.boundingBox.min.y) *value;
                        if(height /2 +cap.position.y){
                            cap.position.y = (height/2 -0.5)>0?(height /2 -0.5):0,5;
                        }else{
                            cap.position.y -= 0.1;
                        }
                    }
                }
                that.render.render(that.scene,that.camera);
            };
            animate();
        },
        Cube:function(){
            /*
            * fftSize,设置FFT(FFT是离散傅立叶变换的快速算法,用于将一个音频信号转化称频域)的大小,用于分析得到的频域,为32-2048之间的2的整数倍,默认是2048,实时得到的频域个数是fftSize的一半
            * frequencyBinCount是FFT值的一半,即实时得到的音频频域的数据个数
            * */
            analyser.fftSize = 128;
            var length = analyser.frequencyBinCount;       //128/2 = 64
            var array = new Uint8Array(length);
            var context = this.canvas.getContext('2d');
            var that = this;
            var little = [];   //存放小方块的上一个位置的高度
            function animate(){
                window.requestAnimationFrame(animate);
                analyser.getByteFrequencyData(array);    // 复制音频当前的频域数据(数量是frequencyBinCount)到unit8Array(8位无符号整型类化型数组)中,频率
                context.clearRect(0,0,that.WIDTH,that.HEIGHT);
                var cube_wid =  Math.ceil(that.WIDTH*0.88/64-3),  //每个频域的长度
                    cube_hei;
                var x = that.WIDTH*0.06;    //起始x
                for(var i = 0; i < length; i++) {
                    cube_hei = array[i]/256 *0.6*that.HEIGHT ;   //最大值为512(频域值)*高低压
                    //console.log(array[i]);
                    //小方块
                    if(little.length<length){
                        little.push(array[i]);
                    }
                    context.fillStyle = '#000';
                    if(little[i]<array[i]){   //当前值大于之前的值
                        if(player.little == 'true')
                            context.fillRect(x,that.HEIGHT*0.87 - cube_hei,cube_wid,10);
                        little[i] = array[i];
                    }
                    else{
                        if(player.little == 'true')
                            context.fillRect(x,that.HEIGHT*0.87 - little[i]-1,cube_wid,10);
                        little[i]-=1;
                    }
                    //长柱形图
                    if(player.linearcolor){
                        //渐变色
                        var grant = context.createLinearGradient(0,0,0,that.HEIGHT);
                        grant.addColorStop(0,player.color);
                        grant.addColorStop(1,player.linearcolor);
                        context.fillStyle = grant;
                    }
                    else context.fillStyle = player.color;     //单色调
                    context.fillRect(x,that.HEIGHT*0.87 - cube_hei+10+5,cube_wid,cube_hei);  //地基高度
                    //阴影
                    if(player.shadow == 'true'){
                        context.shadowOffsetX = 5;
                        context.shadowOffsetY = -5;
                        context.shadowColor = 'rgba(100,100,100,0.5)';
                        context.shadowBlur =1.5;
                    }
                    else {
                        context.shadowColor = 'rgba(100,100,100,0)';
                    }
                    x += cube_wid + 3;  //间距为3
                }
            }
            animate();
        },
        Waveform:function(){
            analyser.fftSize = 2048;   //不使用默认值，效果不好，频域过于接近
            var length = analyser.frequencyBinCount;
            var array = new Uint8Array(length);   //定义8位无符号整型值数组
            var context = this.canvas.getContext('2d');
            var that = this;
            context.clearRect(0, 0,that.WIDTH,that.HEIGHT);

            function d(){
                window.requestAnimationFrame(d);  //类似于setTimeout,请求下一帧
                analyser.getByteTimeDomainData(array);   //获取波形数据

                if(player.linearcolor){
                    var gnt1 = context.createLinearGradient(0,1/2*that.HEIGHT,that.WIDTH,1/2*that.HEIGHT); //线性渐变的起止坐标
                    gnt1.addColorStop(0,player.color);//创建渐变的开始颜色，0表示偏移量，个人理解为直线上的相对位置，最大为1，一个渐变中可以写任意个渐变颜色
                    gnt1.addColorStop(1,player.linearcolor);
                    context.strokeStyle = gnt1;
                }
                else {
                    context.strokeStyle = player.color;
                }
                context.lineWidth = 2;
                context.fillRect(0, 0,that.WIDTH, that.HEIGHT);
                context.beginPath();
                context.fillStyle = '#f2f2f2';

                var sliceWidth = (that.WIDTH * 1.0) / length;    //每段值的长度(画满整个画布)
                var x = 0;
                for(var i = 0; i < length; i++) {

                    var v = array[i] / 128.0;   //保持在画布中间显示
                    var y = (v * that.HEIGHT)/2;

                    if(i === 0) {
                        context.moveTo(x, y); //起点
                    } else {
                        context.lineTo(x, y);
                    }

                    x += sliceWidth;
                }
                context.lineTo(that.WIDTH, that.HEIGHT/2);  //结束点
                context.stroke();
            }
            d();
        },
        Arc:function(){
            analyser.fftSize = 256;
            var length = analyser.frequencyBinCount;
            var array = new Uint8Array(length);
            var that = this,pot=[];
            var little = []; // 存储上一波的值
            var lastcolor = 'r';
            var context = this.canvas.getContext('2d');  //创建context对象
            //获取随机数
            function random(m,n){
                return Math.round(Math.random()*(n-m)+m);  //取0-1之间的随机数
            }
            _.each(array,function(v,k){
                var x = random(0,that.WIDTH),
                    y = random(0,that.HEIGHT),
                    color = 'rgb('+random(0,255)+',0,0)';
                pot.push({x:x,y:y,color:color});
            });
            function animate(){
                window.requestAnimationFrame(animate);
                context.clearRect(0, 0,that.WIDTH,that.HEIGHT);
                analyser.getByteFrequencyData(array);    // 复制音频当前的频域数据(数量是frequencyBinCount)到unit8Array(8位无符号整型类化型数组)中,频率
                if(player.maxColor != lastcolor ) {
                    //color改变的时候
                    _.each(array,function (v,k) {
                        var color;
                        if(player.maxColor == 'r')  color = 'rgb('+random(0,255)+',0,0)';
                        else if(player.maxColor == 'g')  color = 'rgb(0,'+random(0,255)+','+'0)';
                        else color = 'rgb(0,0,'+random(0,255)+')';
                        lastcolor =  player.maxColor;
                        pot[k].color = color;
                        // console.log(player.maxColor);
                    });
                }
                _.each(array,function(v,k){
                    if(little.length<array.length){
                        //第一次
                        little.push(v);
                    }
                    context.beginPath();
                    if(little[k]<v){
                        context.arc(pot[k].x,pot[k].y,v/4,0,Math.PI*2,true);
                        little[k] = v;
                    }
                    else {
                        var r = little[k]/4-2;
                        if(r <= 0) r=0;
                        context.arc(pot[k].x,pot[k].y,r,0,Math.PI*2,true);
                        little[k] = r;
                    }
                    context.closePath();
                    context.fillStyle = pot[k].color;
                    context.fill();
                });



                // context.beginPath();
                // context.arc(200,150,100,0,Math.PI*2,true);

                // context.fillStyle = 'green';//本来这里最初使用的是red，截图一看，傻眼了，怕上街被爱国者打啊，其实你懂的~~
                // context.fill();
            }
            animate();
        }
    }
});
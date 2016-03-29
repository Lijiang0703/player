/*
*绘制音频图
* */
define([
    'player/app/variable/main',
    'three',
    'OrbitControls'
],function(){
    player.draw = {
        draw:function(type){
            var canvas = document.createElement('canvas');
            canvas.width = $('#myshow').width();
            canvas.height = $('#myshow').height();
            $('#myshow').html(canvas);
            switch (type){
                case 'line': this.Waveform(canvas); break;
                case 'point':this.Arc(canvas);break;
                case '2cube':this.Cube(canvas);break;
                case '3cube':this.Cube3d(canvas);break;
            }
        },
        Cube3d:function(canvas){
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
                    //var geometry = new THREE.CubeGeometry( cube_wid/40, array[i]/256 *0.6*HEIGHT/40, DEPTH );
                    var geometry = new THREE.CubeGeometry( 1, 1, 1 );
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
        Cube3D:function(canvas){
            //准备
            analyser.fftSize = 128;
            var length = analyser.frequencyBinCount,       //256/2=128个
                array = new Uint8Array(length),
                WIDTH = canvas.width,
                HEIGHT = canvas.height,
                DEPTH = 10,  //z
                cube_wid =  Math.ceil((WIDTH*0.88/64-3));  //每个频域的长度

            var render = new THREE.WebGLRenderer({
                canvas:canvas,
                antialias: true
            }),
                camera = new THREE.PerspectiveCamera(45, WIDTH / HEIGHT, 1, 1000),
                scene = new THREE.Scene(),
                spotLight = new THREE.SpotLight(0xffffff),   //聚光灯
                ambientLight = new THREE.AmbientLight(0x0c0c0c),  //环境光
                directionalLight = new THREE.DirectionalLight(0xffffff, 0.7);  //平行光

            directionalLight.castShadow = true;
            directionalLight.position.set(0, 10, 10);
            //scene.add(directionalLight);
            render.setClearColor(0x212121);
            //render.setSize(WIDTH, HEIGHT);
            render.shadowMapEnabled = true;

            //柱条的材质
            var cubematerial = new THREE.MeshPhongMaterial({
                color:0x01ff00,  //材质对光的反射能力
                ambient:0x01ff00,
                specular:0x01ff00,
                shiness:20,
                reflectivity:5.5
            });
            //顶部方块的形状和材质
            //var capgeometry = new THREE.CubeGeometry();
            var capmaterial = new THREE.MeshPhongMaterial({
                color:0xffffff
                //ambient:0x01ff00,
                //specular:0x01ff00,
                //shiness:20,
                //reflectivity:5.5
            });
            //镜头
            var orbitControls = new THREE.OrbitControls(camera);
            orbitControls.minDistance = 50;  //最小距离
            orbitControls.maxDistance = 200;   //最大距离
            orbitControls.maxPolarAngle = 1.5;  //最大角度

            function  an(){
                window.requestAnimationFrame(an);
                analyser.getByteFrequencyData(array);
                for(var i=0; i<length; i++){
                    var cube_hei = array[i]/256 *0.6*HEIGHT;
                    var cubegeometry = new THREE.CubeGeometry(cube_wid,cube_hei,DEPTH);
                    var cube = new THREE.Mesh(cubegeometry,cubematerial);
                    cube.position.x = WIDTH +3;
                    cube.position.y = -1;
                    cube.position.z = 0.5;
                    cube.castShadow = true;
                    scene.add(cube);
                }

                render.render(scene,camera);
            }
            camera.position.set(0,10,100);
            camera.lookAt(scene.position);
            scene.add(camera);
            //scene.add(ambientLight);
            spotLight.position.set(0, 60, 40);
            spotLight.shadowCameraVisible = true;
            //scene.add(spotLight);
        },
        Cube:function(canvas){
            /*
            * fftSize,设置FFT(FFT是离散傅立叶变换的快速算法,用于将一个音频信号转化称频域)的大小,用于分析得到的频域,为32-2048之间的2的整数倍,默认是2048,实时得到的频域个数是fftSize的一半
            * frequencyBinCount是FFT值的一半,即实时得到的音频频域的数据个数
            * */
            analyser.fftSize = 128;
            var length = analyser.frequencyBinCount;       //128/2 = 64
            var array = new Uint8Array(length);
            var WIDTH = canvas.width,
                HEIGHT = canvas.height;
            var context = canvas.getContext('2d');  //创建context对象
            var little = [];   //存放小方块的上一个位置的高度
            function animate(){
                window.requestAnimationFrame(animate);
                analyser.getByteFrequencyData(array);    // 复制音频当前的频域数据(数量是frequencyBinCount)到unit8Array(8位无符号整型类化型数组)中,频率
                context.clearRect(0,0,WIDTH,HEIGHT);
                var cube_wid =  Math.ceil(WIDTH*0.88/64-3),  //每个频域的长度
                    cube_hei;
                var x = WIDTH*0.06;    //起始x
                for(var i = 0; i < length; i++) {
                    cube_hei = array[i]/256 *0.6*HEIGHT ;   //最大值为512(频域值)*高低压
                    //console.log(array[i]);
                    //小方块
                    if(little.length<length){
                        little.push(array[i]);
                    }
                    context.fillStyle = '#000';
                    if(little[i]<array[i]){   //当前值大于之前的值
                        if(player.little == 'true')
                            context.fillRect(x,HEIGHT*0.87 - cube_hei,cube_wid,10);
                        little[i] = array[i];
                    }
                    else{
                        if(player.little == 'true')
                            context.fillRect(x,HEIGHT*0.87 - little[i]-1,cube_wid,10);
                        little[i]-=1;
                    }
                    //长柱形图
                    if(player.linearcolor){
                        //渐变色
                        var grant = context.createLinearGradient(0,0,0,HEIGHT);
                        grant.addColorStop(0,player.color);
                        grant.addColorStop(1,player.linearcolor);
                        context.fillStyle = grant;
                    }
                    else context.fillStyle = player.color;     //单色调
                    context.fillRect(x,HEIGHT*0.87 - cube_hei+10+5,cube_wid,cube_hei);  //地基高度
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
        Waveform:function(canvas){
            analyser.fftSize = 2048;   //不使用默认值，效果不好，频域过于接近
            var length = analyser.frequencyBinCount;
            var array = new Uint8Array(length);   //定义8位无符号整型值数组

            var WIDTH = canvas.width,
                HEIGHT = canvas.height;

            var context = canvas.getContext('2d');  //创建context对象
            context.clearRect(0, 0,WIDTH,HEIGHT);

            function d(){
                window.requestAnimationFrame(d);  //类似于setTimeout,请求下一帧
                analyser.getByteTimeDomainData(array);   //获取波形数据

                if(player.linearcolor){
                    var gnt1 = context.createLinearGradient(0,1/2*HEIGHT,WIDTH,1/2*HEIGHT); //线性渐变的起止坐标
                    gnt1.addColorStop(0,player.color);//创建渐变的开始颜色，0表示偏移量，个人理解为直线上的相对位置，最大为1，一个渐变中可以写任意个渐变颜色
                    gnt1.addColorStop(1,player.linearcolor);
                    context.strokeStyle = gnt1;
                }
                else {
                    context.strokeStyle = player.color;
                }
                context.lineWidth = 2;
                context.fillRect(0, 0,WIDTH, HEIGHT);
                context.beginPath();
                context.fillStyle = '#f2f2f2';

                var sliceWidth = (WIDTH * 1.0) / length;    //每段值的长度(画满整个画布)
                var x = 0;
                for(var i = 0; i < length; i++) {

                    var v = array[i] / 128.0;   //保持在画布中间显示
                    var y = (v * HEIGHT)/2;

                    if(i === 0) {
                        context.moveTo(x, y); //起点
                    } else {
                        context.lineTo(x, y);
                    }

                    x += sliceWidth;
                }
                context.lineTo(WIDTH, HEIGHT/2);  //结束点
                context.stroke();
            }
            d();
        },
        Arc:function(canvas){
            analyser.fftSize = 512;
            var length = analyser.frequencyBinCount;
            var array = new Uint8Array(length);
            var WIDTH = canvas.width,
                HEIGHT = canvas.height;

            var context = canvas.getContext('2d');  //创建context对象
            context.clearRect(0, 0,WIDTH,HEIGHT);

            function animate(){
                window.requestAnimationFrame(animate);
                analyser.getByteFrequencyData(array);    // 复制音频当前的频域数据(数量是frequencyBinCount)到unit8Array(8位无符号整型类化型数组)中,频率
                //console.log(array);

                context.beginPath();
                context.arc(200,150,100,0,Math.PI*2,true);
                context.closePath();
                context.fillStyle = 'green';//本来这里最初使用的是red，截图一看，傻眼了，怕上街被爱国者打啊，其实你懂的~~
                context.fill();
            }
            animate();
        }
    }
});
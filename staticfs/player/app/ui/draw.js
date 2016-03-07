/*
*绘制音频图
* */
define([
    'player/app/variable/main',
    'three'
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
                case '3cube':this.draw3D(canvas);break;
            }
        },
        draw2D:function(){
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
        draw3D:function(){
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
        Cube:function(canvas){
            /*
            * fftSize,设置FFT(FFT是离散傅立叶变换的快速算法,用于将一个音频信号转化称频域)的大小,用于分析得到的频域,为32-2048之间的2的整数倍,默认是2048,实时得到的频域个数是fftSize的一半
            * frequencyBinCount是FFT值的一半,即实时得到的音频频域的数据个数
            * */
            analyser.fftSize = 512;
            var length = analyser.frequencyBinCount;
            var array = new Uint8Array(length);
            var WIDTH = canvas.width,
                HEIGHT = canvas.height;

            var context = canvas.getContext('2d');  //创建context对象
            context.clearRect(0, 0,WIDTH,HEIGHT);

            function animate(){
                /*
                 * 实现动画效果
                 * */
                window.requestAnimationFrame(animate);
                analyser.getByteFrequencyData(array);    // 复制音频当前的频域数据(数量是frequencyBinCount)到unit8Array(8位无符号整型类化型数组)中,频率
                //console.log(array);

                var cube_wid =  (WIDTH / length) * 4,   //每个频域的长度
                    cube_hei;
                var x = WIDTH*0.1;    //起始x
                for(var i = 0; i < length; i++) {
                    cube_hei = array[i]/2;
                    var grant = context.createLinearGradient(0,0,0,HEIGHT);
                    grant.addColorStop(0,player.color);
                    grant.addColorStop(1,'rgb(20,20,20)');
                    context.fillStyle = grant;
                    //context.fillStyle = 'rgb(' + (cube_hei+100) + ',50,50)';
                    context.fillRect(x,HEIGHT/1.5-cube_hei,cube_wid,cube_hei);  //地基高度

                    x += cube_wid + 10;  //间距为10
                }
            }
            animate();
        },
        Waveform:function(canvas){
            analyser.fftSize = 2048;   //不使用默认值，效果不好，频域过于接近
            var length = analyser.frequencyBinCount;
            var array = new Uint8Array(length);

            var WIDTH = canvas.width,
                HEIGHT = canvas.height;

            var context = canvas.getContext('2d');  //创建context对象
            context.clearRect(0, 0,WIDTH,HEIGHT);

            function d(){
                window.requestAnimationFrame(d);  //类似于setTimeout
                analyser.getByteTimeDomainData(array);   //获取波形数据

                var gnt1 = context.createLinearGradient(0,1/2*HEIGHT,WIDTH,1/2*HEIGHT); //线性渐变的起止坐标
                gnt1.addColorStop(0,'red');//创建渐变的开始颜色，0表示偏移量，个人理解为直线上的相对位置，最大为1，一个渐变中可以写任意个渐变颜色
                gnt1.addColorStop(1,'yellow');
                context.lineWidth = 2;
                context.fillStyle = 'rgb(255, 255, 255)';
                context.fillRect(0, 0,WIDTH, HEIGHT);
                context.strokeStyle = gnt1;
                //context.strokeStyle = 'rgb(0, 0, 0)';
                context.beginPath();

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
                /*
                 * 实现动画效果
                 * */
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
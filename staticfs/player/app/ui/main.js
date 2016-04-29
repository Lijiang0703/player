define([
    'player/app/ui/tab',
    'player/app/ui/base',
    'player/app/ui/audio',
    'player/app/ui/lyric',
    'spectrum',
    'Cookie',
    'joyride'
],function(){
    player.menu = require('player/app/ui/tab');
    player.menu.upload();
    player.menu.changeType();
    player.menu.changeEffect();
    player.menu.chooseLinear();
    player.menu.chooseAttr();
    player.color = 'rgb(238, 204, 204)';
    //设置全局audioContext
    window.audioContext = player.audio.audioApi();
    window.requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.msRequestAnimationFrame;
    window.cancelAnimationFrame = window.cancelAnimationFrame || window.webkitCancelAnimationFrame || window.mozCancelAnimationFrame || window.msCancelAnimationFrame;
    window.analyser = window.audioContext.createAnalyser();
    window.gainNode = window.audioContext.createGain();    //创建增益节点,控制音量
    gainNode.gain.value = 0.8;
    //从服务器读取音频名称列表
    $(document).ready(function(){
        $.ajax({
            type:'GET',
            url: 'http://42.96.140.139/index.php/Test/listMusics?{page=0,99}',
            dataType: 'json',
            success:function(data){
                window.base.setlistName(data);  //获取成功后解析文件
            },
            error:function(data,error){
                console.log(data,error);
            }
        });
        //根据cookie判断是否是第一次进入这个页面,若是第一次则进行引导
        if(!$.cookie('player')){
            $('#joyRideTipContent').joyride({
                autoStart : true,
                expose: true
            });
            $.cookie('player','yes');
        }
        //监听音频的点击事件
        $('.list_wpqsD7').on('click',function(e){
            //console.log(e.target);
            var tar = e.target,
                tag = $(e.target).get(0).tagName;
            if(tag == 'A'){     //开始播放
                var run = new player.songs.model({
                    songName:$(tar).data('title'),
                    isrun:true,
                    songElement:this,
                    songUrl:$(tar).data('url')
                });
            }
            if(tag == 'I'){    //移除歌曲
                var id = $(tar).parents('li').attr('id');
                //从数据库中删除
                $.ajax({
                    type:'GET',
                    url: ' http://42.96.140.139/index.php/Test/deleteMusic?id='+id+'&token=lovecll',
                    dataType: 'json',
                    success:function(data){
                        $.ajax({
                            type:'GET',
                            url: 'http://42.96.140.139/index.php/Test/listMusics?{page=0,99}',
                            dataType: 'json',
                            success:function(data){
                                window.base.setlistName(data);  //获取成功后解析文件
                            },
                            error:function(data,error){
                                console.log(data,error);
                            }
                        });
                    },
                    error:function(data,error){
                        console.log(data,error);
                    }
                });
            }
            //console.log(tar);
        });

    });

    //选择显示颜色
    $('.div_1rTtp3,.div_2rTtp3').spectrum({
        allowEmpty:true,
        color: "#ecc",
        showInput: true,
        containerClassName: "full-spectrum",
        showInitial: true,
        showPalette: true,
        showSelectionPalette: true,
        showAlpha: true,
        maxPaletteSize: 10,
        preferredFormat: "hex",
        localStorageKey: "spectrum.demo",
        move: function (color) {
            base.updatecolor(color,this);
        },
        show: function () {

        },
        beforeShow: function () {

        },
        hide: function (color) {
            base.updatecolor(color,this);
        },
        palette: [
            ["rgb(0, 0, 0)", "rgb(67, 67, 67)", "rgb(102, 102, 102)", /*"rgb(153, 153, 153)","rgb(183, 183, 183)",*/
                "rgb(204, 204, 204)", "rgb(217, 217, 217)", /*"rgb(239, 239, 239)", "rgb(243, 243, 243)",*/ "rgb(255, 255, 255)"],
            ["rgb(152, 0, 0)", "rgb(255, 0, 0)", "rgb(255, 153, 0)", "rgb(255, 255, 0)", "rgb(0, 255, 0)",
                "rgb(0, 255, 255)", "rgb(74, 134, 232)", "rgb(0, 0, 255)", "rgb(153, 0, 255)", "rgb(255, 0, 255)"],
            ["rgb(230, 184, 175)", "rgb(244, 204, 204)", "rgb(252, 229, 205)", "rgb(255, 242, 204)", "rgb(217, 234, 211)",
                "rgb(208, 224, 227)", "rgb(201, 218, 248)", "rgb(207, 226, 243)", "rgb(217, 210, 233)", "rgb(234, 209, 220)",
                "rgb(221, 126, 107)", "rgb(234, 153, 153)", "rgb(249, 203, 156)", "rgb(255, 229, 153)", "rgb(182, 215, 168)",
                "rgb(162, 196, 201)", "rgb(164, 194, 244)", "rgb(159, 197, 232)", "rgb(180, 167, 214)", "rgb(213, 166, 189)",
                "rgb(204, 65, 37)", "rgb(224, 102, 102)", "rgb(246, 178, 107)", "rgb(255, 217, 102)", "rgb(147, 196, 125)",
                "rgb(118, 165, 175)", "rgb(109, 158, 235)", "rgb(111, 168, 220)", "rgb(142, 124, 195)", "rgb(194, 123, 160)",
                "rgb(166, 28, 0)", "rgb(204, 0, 0)", "rgb(230, 145, 56)", "rgb(241, 194, 50)", "rgb(106, 168, 79)",
                "rgb(69, 129, 142)", "rgb(60, 120, 216)", "rgb(61, 133, 198)", "rgb(103, 78, 167)", "rgb(166, 77, 121)",
                /*"rgb(133, 32, 12)", "rgb(153, 0, 0)", "rgb(180, 95, 6)", "rgb(191, 144, 0)", "rgb(56, 118, 29)",
                 "rgb(19, 79, 92)", "rgb(17, 85, 204)", "rgb(11, 83, 148)", "rgb(53, 28, 117)", "rgb(116, 27, 71)",*/
                "rgb(91, 15, 0)", "rgb(102, 0, 0)", "rgb(120, 63, 4)", "rgb(127, 96, 0)", "rgb(39, 78, 19)",
                "rgb(12, 52, 61)", "rgb(28, 69, 135)", "rgb(7, 55, 99)", "rgb(32, 18, 77)", "rgb(76, 17, 48)"]
        ]
    });
    $('.div_3rTtp3').spectrum({
        showPaletteOnly: true,
        showPalette:true,
        color: 'rgb(255,0,0)',
        move: function (color) {
            base.updateMain(color,this);
        },
        show: function () {

        },
        beforeShow: function () {

        },
        hide: function (color) {
            base.updateMain(color,this);
        },
        palette: [
            ["rgb(255, 0, 0)","rgb(0, 255, 0)","rgb(0, 0, 255)"]

        ]
    });

});
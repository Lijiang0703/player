define([
    'text!player/app/template/songs.tpl',
    'text!player/app/template/login.tpl',
    'text!player/app/template/run.tpl'
],function(){
    //全局变量
    window.player = {
        songs:{},
        menu:{},
        maxColor:'r',  //色调
        //base:{},
        audio:{},
        draw:{},
        lyric:{}, //歌词
        isHas:{},  //是否已经生成过MediaElementSource
        color:{},   //显示颜色
        showtype:'2cube',  //显示方式,默认是2D柱形图
        addtype:{}   //附加方式
    },
    window.web_url= '/staticfs/',
    window.portal_url = '/',
    window.context_url = 'app/audio/'
});
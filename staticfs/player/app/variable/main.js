define([
    'text!player/app/template/songs.tpl',
    'text!player/app/template/upload.tpl',
    'text!player/app/template/run.tpl'
],function(){
    //全局变量
    window.player = {
        songs:{},
        menu:{},
        //base:{},
        audio:{},
        draw:{}
    },
    window.web_url= '/staticfs',
    window.portal_url = '/',
    window.context_url = 'app/audio/'
});
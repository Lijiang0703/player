//定义了一些基本的方法
define([
    'underscore',
    'player/app/variable/main'
],function(){
    player.base = {
        renderT :function(T,data){
            var objectT = null,template;
            if(!T) return false;
            if(!data)  data = {};
            if(typeof T=='function') template = T;
            if(typeof T=='string') template = _.template(T);
            objectT = $(template(data));
            return objectT;
        }
    };
});
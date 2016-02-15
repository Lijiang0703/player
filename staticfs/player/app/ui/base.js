//定义了一些基本的方法
define([
    'underscore',
    'player/app/variable/main'
],function(){
    player.base = {
        renderT :function(T,data,key){
            var objectT = null,template;
            if(!T) return false;
            if(!data)  data = {};
            if(key){
                var dict={};
                dict[key] = data;
                data = dict;
            }
            if(typeof T=='function') template = T;
            if(typeof T=='string') template = _.template(T);
            objectT = $(template(data));
            return objectT;
        },
        updatecolor:function(color,opts){
            var hexColor = "transparent";
            if(color) {
                hexColor = color.toHexString();
            }
            $(opts).css('background',hexColor);
        }
    };
});
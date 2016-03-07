//定义了一些基本的方法
define([
    'underscore',
    'player/app/variable/main'
],function(){
    window.base = {
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
            player.color =  hexColor;
        },
        str2ab:function (str) {  //字符串转化为arraybuffer对象
            var buf = new ArrayBuffer(str.length*2); // 每个字符占用2个字节
            var bufView = new Uint16Array(buf);
            for (var i=0, strLen=str.length; i<strLen; i++) {
                bufView[i] = str.charCodeAt(i);
            }
            return buf;
        }
    };
});
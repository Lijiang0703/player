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
        },
        str2ab:function (str) {  //字符串转化为arraybuffer对象
            var buf = new ArrayBuffer(str.length*2); // 每个字符占用2个字节
            var bufView = new Uint16Array(buf);
            for (var i=0, strLen=str.length; i<strLen; i++) {
                bufView[i] = str.charCodeAt(i);
            }
            return buf;
        },
        /*
         js原生调用ajax方法
         */
        loadSound:function(url) {
            var request = new XMLHttpRequest(); //建立一个请求
            request.open('GET', url, true); //配置好请求类型，文件路径等
            request.responseType = 'arraybuffer'; //配置数据返回类型
            // 一旦获取完成，对音频进行进一步操作，比如解码
            request.onload = function() {
                var arraybuffer = request.response;
            };
            request.send();
        }
    };
});
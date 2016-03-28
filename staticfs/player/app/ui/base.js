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
        updatecolor:function(color,opts){   //把color转换为rgb形式
            var rgbColor = "rgba(0,0,0,0)";
            if(color) {
                rgbColor = color.toRgbString();
            }
            $(opts).css('background',rgbColor);
            if($(opts).hasClass('div_2rTtp3')){
                player.linearcolor = rgbColor;
            }
            else player.color =  rgbColor;
        },
        setlistName:function(data){  //获取名字
            for(var i=0;i< data.length;i++){
                var name = data[i].name,
                    url = data[i].url,
                    Id = data[i].id;
                var list =  require('text!player/app/template/songs.tpl');
                var listhtml = base.renderT(list,{'songName':name,'songurl':url});
                $(listhtml).attr('id',Id);
                $('.list_wpqsD7').append(listhtml);
            }
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
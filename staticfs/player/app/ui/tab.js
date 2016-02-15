define([
    'player/app/variable/main',
    'dropzone',
    'bootbox',
    'player/app/ui/base',
    'player/app/mvc/songs'
],function(){
    var menu = {
        upload:function(){
            var upload = require('text!player/app/template/upload.tpl');

            $('.fa-upload').on('click',function(){
                var t = player.base.renderT(upload);
                $('#upload').click();

                $('#upload').on('change',function(){
                    if(this.files.length != 0){
                        var file = this.files[0],
                            filename = file.name,
                            songname = filename.split('.')[0];
                        var newsong = new player.songs.model({
                            songName:songname,
                            song:file
                        });
                    }
                });
                // 美化
                //$(t).dropzone({
                //    url:'index.html',
                //    acceptedFiles:'.mp3,.mav,.wma',
                //    init:function(){
                //        this.on('addedfile',function(file){
                //
                //        });
                //        this.on('success',function(){
                //            alert(5);
                //        });
                //    }
                //});
                //
                //bootbox.dialog({
                //    title:'上传',
                //    className:'',
                //    message:upload,
                //    closeButton:true,
                //    buttons:{
                //        OK:{
                //            label:"OK",
                //            callback:function(){
                //
                //            }
                //        }
                //    }
                //});
            });

        }
    };
    return menu;
});
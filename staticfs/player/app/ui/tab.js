define([
    'player/app/variable/main',
    'dropzone',
    'bootbox',
    'player/app/ui/base'
],function(){
    var menu = {
        upload:function(){
            var upload = require('text!player/app/template/upload.tpl');

            var t = player.base.renderT(upload);
            $(t).dropzone({
                url:'index.html',
                acceptedFiles:'.mp3,.mav,.wma',
                init:function(){
                    this.on('addedfile',function(file){

                    });
                    this.on('success',function(){
                        alert(5);
                    });
                }
            });

            $('.fa-upload').on('click',function(){
                bootbox.dialog({
                    title:'上传',
                    className:'',
                    message:upload,
                    closeButton:true,
                    buttons:{
                        OK:{
                            label:"OK",
                            callback:function(){

                            }
                        }
                    }
                });
            });
            $()
        }
    };
    return menu;
});
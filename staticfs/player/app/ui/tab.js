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
                //var t = base.renderT(upload);
                //$('#upload').click();
                //
                //$('#upload').on('change',function(){
                //    if(this.files.length != 0){
                //        var file = this.files[0],
                //            filename = file.name,
                //            songname = filename.split('.')[0];
                //        var newsong = new player.songs.model({
                //            songName:songname,
                //            song:file
                //        });
                //    }
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
            //});

        },
        changeColor:function(){},
        changeType:function(){
            //改变显示的方式
            $('#show_type').change(function(){
                var type = $('#show_type')[0].value;
                player.showtype = type;
                player.audio.getRadio();
            });
        },
        changeEffect:function(){
            //改变附加效果
            $('#addtype').change(function(){
                var add = this.value;
                player.addtype = add;
                player.audio.getRadio();
            });
        },
        chooseLinear:function(){
            $('#uselinear').change(function(){
                if($(this).is(':checked')){
                    $('.div_2H3nzh').css('display','inline-block');
                }
                else{
                    $('.div_2H3nzh').css('display','none');
                    player.linearcolor = '';
                }
            });

        }
    };
    return menu;
});
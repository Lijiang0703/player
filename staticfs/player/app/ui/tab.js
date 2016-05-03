define([
    'player/app/variable/main',
    'player/app/ui/base',
    'player/app/mvc/songs',
    'bootbox'
],function(){
    var menu = {
        upload:function(){
            var upload = require('text!player/app/template/login.tpl');

            $('.fa-upload').on('click',function(){
                var height = $(document).height();
                var sid = localStorage.getItem('sid');
                if(sid){
                    $('body').append($("<div class='mask' style='height: "+height+"px'></div>"));
                    $('.mydrop').css('display','block').addClass('animated fadeInDown');
                }else{
                    $('body').append($("<div class='mask' style='height: "+height+"px'></div>"));
                    var t = base.renderT(upload);
                    $('body').append(t);
                    $(t).css('display','block').addClass('animated fadeInDown');
                }
            });
            $('.Registbutton').live('click',function(){
                window.location = 'regist.html';
            });
            $('.closemask').live('click',function(){
                $('.mask').remove();
                $('#myupload').show();
                $('#fsUploadProgress').empty();
                $('table').hide();
                $('.mydrop').removeClass('animated fadeInDown').css('display','none');
            });
            $('.mybutton').click(function(){
                $('.mask').remove();
                $('#myupload').show();
                $('#fsUploadProgress').empty();
                $('table').hide();
                $('.mydrop').removeClass('animated fadeInDown').css('display','none');
            });
            $('.myadmin').click(function(){
                window.location = 'admin.html';
            });

        },
        changeType:function(){
            //改变显示的方式
            $('#show_type').change(function(){
                var type = $('#show_type')[0].value;
                player.showtype = type;
                if(player.showtype == 'line'){
                    if($(".divmy input[type='radio']").attr('name')){

                    }
                }
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
        },
        chooseAttr:function(){
            //判断radio的选项及状态
            $(".divmy input[type='radio']").change(function(){
                var type = $(this).attr('name');
                if(type == 'shadow'){
                    var isShadow = $(this).val();
                    player.shadow = isShadow;
                }
                if(type == 'little'){
                    var islittle = $(this).val();
                    player.little = islittle;
                }
            });
        }
    };
    return menu;
});
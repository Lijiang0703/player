define([
    'player/app/variable/main',
    'player/app/ui/base',
    'player/app/mvc/songs'
],function(){
    var menu = {
        init:function(){ //注册事件
            this.upload();
            this.changeType();
            this.changeEffect();
            this.chooseAttr();
            this.chooseLinear();
        },
        upload:function(){
            var upload = require('text!player/app/template/login.tpl');
            $('.fa-upload').on('click',function(){  //点击上传按钮
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
            $('.Registbutton').live('click',function(){   //跳转到注册页面
                window.location = 'regist.html';
            });
            $('.Loginbutton').live('click',function(){   //登录按钮
                var name = $(this).parents('#login').find("input[type='text']").val();
                var pass = $(this).parents('#login').find("input[type='password']").val();
                $.ajax({
                    type: 'POST',
                    url: 'http://42.96.140.139/index.php/Test/login?mobile='+name+'&password='+pass,
                    dataType:'json',
                    success: function (data) {
                        // localStorage.setItem('sid','1');
                        var data = data.data;
                        $('.mylogin').html('欢迎您 '+data.mobile);
                        if(data.type == 2){
                            $('.myadmin').css('display','inline-block');
                        }
                        else {
                            $('.myadmin').css('display','none');
                        }
                        $('.mask').remove();
                        $('#login').remove();
                    }
                });
            });
            $('.closemask').live('click',function(){  //关闭窗口
                $('.mask').remove();
                $('#myupload').show();
                $('#fsUploadProgress').empty();
                $('table').hide();
                $('.mydrop').removeClass('animated fadeInDown').css('display','none');
            });
            $('.mybutton').click(function(){  //上传成功
                $('.mask').remove();
                $('#myupload').show();
                $('#fsUploadProgress').empty();
                $('table').hide();
                $('.mydrop').removeClass('animated fadeInDown').css('display','none');
            });
            $('.myadmin').click(function(){   //跳转到管理页面
                window.location = 'admin.html';
            });
            $('#regist').click(function(){  //注册按钮
                var form = $(this).parents('form');
                var name = $(form).find("input[type='text']").val();
                var pass = $(form).find("input[type='password']").val();
                $.ajax({
                    type:'POST',
                    url:'http://42.96.140.139/index.php/Test/register?mobile='+name+'&password='+pass,
                    dataType:'json',
                    success:function(data){
                        var data = JSON.stringify(data.data);
                        window.location =  'index.html';
                        localStorage.setItem('sid',data);
                        // localStorage.setItem({'sid':data.data.id,'name':data.data.mobile,'type':data.data.type});
                    }
                });
            })

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
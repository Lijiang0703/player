/**
 * Created by lijiang on 16/5/18.
 */
require(['player/app/variable/main'],function(){
    $(document).ready(function () {
        $('#regist').click(function(){  //注册按钮
            var form = $(this).parents('form');
            var name = $(form).find("input[type='text']").val();
            var pass = $(form).find("input[type='password']").val();
            $('#form-horizontal').validate({
                rules:{
                    name:{
                        required:true
                    },
                    password:{
                        required:true
                    },
                    password_again:{
                        required:true
                    }
                },
                // errorPlacement:function(error,element){
                //     // error.appendTo(element.parent().siblings("span"));
                //     console.log(error);
                // }
                messages: {
                    name: {
                        required: "请填入用户名"
                    },
                    password:{
                        required:"请填入密码"
                    },
                    password_again:{
                        required:"请填入确认密码"
                    }
                }
            });
            if(sessionStorage.getItem('sid')) alert('当前已有用户在线!!');
            $.ajax({
                type:'POST',
                url:'http://42.96.140.139/index.php/Test/register?mobile='+name+'&password='+pass,
                dataType:'json',
                success:function(data){
                    var data = JSON.stringify(data.data);
                    sessionStorage.setItem('sid',data);
                    window.location =  'index.html';
                    // localStorage.setItem('sid',data);
                }
            });
        })
    })
});
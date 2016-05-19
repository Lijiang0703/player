/**
 * Created by lijiang on 16/5/4.
 */
define(['player/app/variable/main','underscore'],function(){
    $(document).ready(function(){
        $.ajax({
            type:'GET',
            url:'http://42.96.140.139/index.php/Test/listMusics?{page=0,99}',
            dataType: 'json',
            success:function(data){
                setuesrlist();
                //列出歌曲
                setname(data);
            }
        });
        var session = JSON.parse(sessionStorage.getItem('sid')).mobile;
        $('#welcome').html('欢迎您 '+session);
        $('#accounts-menu').live('click',function(e){
            var tar = e.target;
            if($(tar).hasClass('fa-remove')){
                //执行删除操作
                var id =$(tar).parent('li').attr('id');
                var token = JSON.parse(sessionStorage.getItem('sid')).token;
                $.ajax({
                    type:'GET',
                    url: ' http://42.96.140.139/index.php/Test/deleteMusic?id='+id+'&token='+token,
                    dataType: 'json',
                    success:function(data){
                        $.ajax({
                            type:'GET',
                            url: 'http://42.96.140.139/index.php/Test/listMusics?{page=0,99}',
                            dataType: 'json',
                            success:function(data){
                                setname(data);
                            },
                            error:function(data,error){
                                console.log(data,error);
                            }
                        });
                    },
                    error:function(data,error){
                        console.log(data,error);
                    }
                });
            }
            if($(tar).hasClass('fa-upload')){
                //上传歌词
                
            }
        });
        $('#dashboard-menu').live('click',function(e){
            var tar = e.target;
            var uid = $(tar).parents('li').data('id');
            var token = JSON.parse(sessionStorage.getItem('sid')).token;
            if($(tar).hasClass('fa-remove')){
                //删除用户
                $.ajax({
                    type:'GET',
                    url:'http://42.96.140.139/index.php/Test/deleteUser?uid='+uid+'&token='+token,
                    dataType:'json',
                    success:function(){
                        setuesrlist();
                    },
                    error:function (error) {
                        console.log(error);
                    }
                })
            }
            if($(tar).hasClass('myup')){
                //升级为管理员
                $.ajax({
                    type:'GET',
                    url:'http://42.96.140.139/index.php/Test/promoteUser?uid='+uid+'&token='+token,
                    dataType:'json',
                    success:function(){
                        setuesrlist();
                    },
                    error:function (error) {
                        console.log(error);
                    }
                })
            }
        });
    });
    function setname(data){
        $('#accounts-menu').empty();
        _.each(data,function(v,k){  //歌曲列表
            var name = v.name,
                url = v.url,
                Id = v.id;
            $('#accounts-menu').append("<li id='"+Id+"' data-url=url><a href='#'>"+name+"</a><i class='fa fa-upload' id='lyricupload'></i><i class='fa fa-remove'></i></li>");
        });
    }
    function setuesrlist() {
        var token = JSON.parse(sessionStorage.getItem('sid')).token;
        $.ajax({
            type:'GET',
            url:'http://42.96.140.139/index.php/Test/listUsers?token='+token,
            dataType: 'json',
            success:function(data){
                //列出用户
                $('#dashboard-menu').empty();
                _.each(data,function (v) {
                    var t = _.template(require('text!player/app/template/users.tpl'),{'Id':v.id,'name':v.username});
                    $('#dashboard-menu').append(t);
                });
            },
            error:function (data) {
                console.log(data);
            }
        });
    }
});
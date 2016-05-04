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
                $.ajax({
                    type:'GET',
                    url: ' http://42.96.140.139/index.php/Test/deleteMusic?id='+id+'&token=lovecll',
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
    });
    function setname(data){
        $('#accounts-menu').empty();
        _.each(data,function(v,k){  //歌曲列表
            var name = v.name,
            // url = v.url,
                Id = v.id;
            $('#accounts-menu').append("<li id='"+Id+"'><a href='#'>"+name+"</a><i class='fa fa-upload'></i><i class='fa fa-remove'></i></li>");
        });
    }
});
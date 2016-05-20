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
                var id = $(tar).parent().attr('id');
                var index = $(tar).parent().index();
                localStorage.setItem('songid',id);
                if(window.upload) return;
                //上传歌词
                window.upload = Qiniu.uploader({
                    runtimes: 'html5,flash,html4',    //上传模式,依次退化
                    browse_button: 'lyricupload',       //上传选择的点选按钮，**必需**
                    //uptoken_url: '',
                    uptoken_url : 'http://42.96.140.139/index.php/Test/gettoken', //若未指定uptoken_url,则必须指定 uptoken ,uptoken由其他程序生成
                    unique_names: true,
                    domain: 'http://7xr9x7.com1.z0.glb.clouddn.com/',
                    max_retries: 3,                   //上传失败最大重试次数
                    filters:{        //上传文件的限制类型大小
                        max_file_size: '1mb',           //最大文件体积限制
                        prevent_duplicates: true,       //禁止重复选择
                        mime_types:[{
                            title:'Lrc files',extensions:'lrc'    //限制上传格式
                        }]
                    },
                    multi_selection: false,    //每次只能选择一个文件
                    dragdrop: true,                   //开启可拖曳上传
                    // drop_element: 'container',        //拖曳上传区域元素的ID，拖曳文件或文件夹后可触发上传
                    chunk_size: '4mb',                //分块上传时，每片的体积
                    auto_start: true,                 //选择文件后自动上传，若关闭需要自己绑定事件触发上传
                    init: {
                        'FilesAdded': function(up, files) {

                        },
                        'BeforeUpload': function(up, file) {
                            // 每个文件上传前,处理相关的事情

                        },
                        'UploadProgress': function(up, file) {

                        },
                        'UploadComplete':function(){

                        },
                        'FileUploaded': function(up, file, info) {
                            var domain = up.getOption('domain');
                            var res = JSON.parse(info);
                            var link = domain + res.key; //获取上传成功后的文件的Url
                            var token = JSON.parse(sessionStorage.getItem('sid')).token;
                            var id = localStorage.getItem('songid');
                            file.url = link;
                            //window.base.setlistName([file]);
                            //保存到数据库
                            $.ajax({
                                type:'GET',
                                url:'http://42.96.140.139/index.php/Test/uploadLrcs?mid='+id+'&token='+token+'&url='+link,
                                dataType: 'json',
                                success:function(data){
                                    alert('上传成功');
                                    window.onload = '';
                                },
                                error:function(data,error){
                                    // console.log(data,error);
                                    alert('上传失败');
                                }
                            });
                        },
                        'Error': function(up, err, errTip) {
                        },
                        'UploadComplete': function() {
                        },
                        'Key': function(up, file) {
                        }
                    }
                });
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
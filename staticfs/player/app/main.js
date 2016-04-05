require([
    'player/app/ui/main',
    'jquery',
    'bootstrap',
    'progress'
],function(){
    var uploader = Qiniu.uploader({
        runtimes: 'html5,flash,html4',    //上传模式,依次退化
        browse_button: 'myupload',       //上传选择的点选按钮，**必需**
        //uptoken_url: '',
        uptoken_url : 'http://42.96.140.139/index.php/Test/gettoken', //若未指定uptoken_url,则必须指定 uptoken ,uptoken由其他程序生成

        //Ajax请求upToken的Url，**强烈建议设置**（服务端提供）
        // uptoken : '<Your upload token>',
        //若未指定uptoken_url,则必须指定 uptoken ,uptoken由其他程序生成
         unique_names: true,
        // 默认 false，key为文件名。若开启该选项，SDK会为每个文件自动生成key（文件名）
        // save_key: true,
        // 默认 false。若在服务端生成uptoken的上传策略中指定了 `sava_key`，则开启，SDK在前端将不对key进行任何处理
        domain: 'http://7xr9x7.com1.z0.glb.clouddn.com/',
        //bucket 域名，下载资源时用到，**必需**
        container: 'container',           //上传区域DOM ID，默认是browser_button的父元素，
        //flash_swf_url: 'js/plupload/Moxie.swf',  //引入flash,相对路径
        max_retries: 3,                   //上传失败最大重试次数
        filters:{        //上传文件的限制类型\大小
            max_file_size: '100mb',           //最大文件体积限制
            prevent_duplicates: true,       //禁止重复选择
            mime_types:[{
                title:'Radio files',extensions:'mp3'    //限制上传格式
            }]
        },
        multi_selection: false,    //每次只能选择一个文件
        dragdrop: true,                   //开启可拖曳上传
        drop_element: 'container',        //拖曳上传区域元素的ID，拖曳文件或文件夹后可触发上传
        chunk_size: '4mb',                //分块上传时，每片的体积
        auto_start: true,                 //选择文件后自动上传，若关闭需要自己绑定事件触发上传
        init: {
            'FilesAdded': function(up, files) {
                $('#myupload').hide();
                $('table').show();
                plupload.each(files, function(file) {
                    // 文件添加进队列后,处理相关的事情
                    var progress = new FileProgress(file, 'fsUploadProgress');
                    progress.setStatus("等待...");
                    progress.bindUploadCancel(up);
                });
            },
            'BeforeUpload': function(up, file) {
                // 每个文件上传前,处理相关的事情
                var progress = new FileProgress(file, 'fsUploadProgress');
                var chunk_size = plupload.parseSize(this.getOption('chunk_size'));
                if (up.runtime === 'html5' && chunk_size) {
                    progress.setChunkProgess(chunk_size);
                }
            },
            'UploadProgress': function(up, file) {
                // 每个文件上传时,处理相关的事情
                //progressJs().onProgress(function(targetElm, percent){
                //    console.log('the progress is:'+percent);
                //});
                var progress = new FileProgress(file, 'fsUploadProgress');
                var chunk_size = plupload.parseSize(this.getOption('chunk_size'));
                progress.setProgress(file.percent + "%", file.speed, chunk_size);
            },
            'UploadComplete':function(){

            },
            'FileUploaded': function(up, file, info) {
                // 每个文件上传成功后,处理相关的事情
                // 其中 info 是文件上传成功后，服务端返回的json，形式如
                // {
                //    "hash": "Fh8xVqod2MQ1mocfI4S4KpRL6D98",
                //    "key": "gogopher.jpg"
                //  }
                // 参考http://developer.qiniu.com/docs/v6/api/overview/up/response/simple-response.html
                var domain = up.getOption('domain');
                var res = jQuery.parseJSON(info);
                var link = domain + res.key; //获取上传成功后的文件的Url
                var name = file.name;
                var hash = res.hash;
                file.url = link;
                //window.base.setlistName([file]);
                //保存到数据库
                $.ajax({
                    type:'GET',
                    //url:'http://42.96.140.139/index.php/Test/uploadMusic?name='+name+'&link='+link,
                    url:'http://42.96.140.139/index.php/Test/uploadMusic?name='+name+'&link='+link+'&hash='+hash+'&token=lovecll',
                    datatype:'json',
                    success:function(data){
                        //刷新曲目列表
                        //window.base.setlistName([file]);
                        $.ajax({
                            type:'GET',
                            url: 'http://42.96.140.139/index.php/Test/listMusics?{page=0,99}',
                            dataType: 'json',
                            success:function(data){
                                window.base.setlistName(data);  //获取成功后解析文件
                            },
                            error:function(data,error){
                                console.log(data,error);
                            }
                        });
                    }
                });
                var progress = new FileProgress(file, 'fsUploadProgress');
                progress.setComplete(up, info);
            },
            'Error': function(up, err, errTip) {
                //上传出错时,处理相关的事情
            },
            'UploadComplete': function() {
                //队列文件处理完毕后,处理相关的事情
            },
            'Key': function(up, file) {
                // 若想在前端对每个文件的key进行个性化处理，可以配置该函数
                // 该配置必须要在 unique_names: false , save_key: false 时才生效
                var key = "";
                // do something with key here
                return key
            }
        }
    });
 //domain 为七牛空间（bucket)对应的域名，选择某个空间后，可通过"空间设置->基本设置->域名设置"查看获取
 //uploader 为一个plupload对象，继承了所有plupload的方法，参考http://plupload.com/docs
});
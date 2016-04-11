var  path = {
    'dropzone': 'thirdparty/dropzone/dropzone-amd-module.min',
    'jquery': 'thirdparty/jquery/jquery.min',
    'text':  'thirdparty/requirejs/text',
    'backbone': 'thirdparty/backbone/backbone-0.9.10',
    'underscore': 'thirdparty/backbone/underscore-1.4.4',
    'spectrum': 'thirdparty/spectrum/spectrum',
    'bootstrap': 'thirdparty/bootstrap/bootstrap.min',
    'bootbox': 'thirdparty/bootbox/bootbox.min',
    'three': 'thirdparty/three.js-master/three.min',
    //'three': 'thirdparty/three.js-master/build/three',
    'stats':'thirdparty/stats/bulid/stats.min',
    'OrbitControls':'thirdparty/OrbitControls/OrbitControls',
    'plupload':'thirdparty/plupload-2.1.8/js/plupload.dev',
    'moxie':'thirdparty/plupload-2.1.8/js/moxie',
    'qiniu':'thirdparty/qiniu/src/qiniu',
    'Cookie':'thirdparty/jquery-cookie/jquery.cookie',
    'joyride':'thirdparty/joyride/jquery.joyride-2.1',
    'progress':'thirdparty/progress.js-master/src/progress'
};
var shim = {
    'backbone': {
        deps: ['underscore', 'jquery'],
        exports: 'Backbone'
    },
    'spectrum': {
        deps: ['jquery']
    },
    'dropzone':{
        deps: ['jquery']
    },
    'bootbox': {
        deps: ['bootstrap','jquery'],
        exports:'bootbox'
    },
    'joyride':{
        deps: ['jquery']
    },
    'OrbitControls':{
        deps:['three']
    }
};
require.config({
    baseUrl:'/staticfs/',
    paths:path,
    shim:shim
});
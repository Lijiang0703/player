var  path = {
    'dropzone': 'thirdparty/dropzone/dropzone-amd-module.min',
    'jquery': 'thirdparty/jquery/jquery.min',
    'text':  'thirdparty/requirejs/text',
    'backbone': 'thirdparty/backbone/backbone-0.9.10',
    'underscore': 'thirdparty/backbone/underscore-1.4.4',
    'spectrum': 'thirdparty/spectrum/spectrum',
    'bootstrap': 'thirdparty/bootstrap/bootstrap.min',
    'bootbox': 'thirdparty/bootbox/bootbox'
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
        deps: ['bootstrap']
    }
};
require.config({
    baseUrl:'/staticfs/',
    paths:path,
    shim:shim
});
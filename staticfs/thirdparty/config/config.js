var  path = {
    'dropzone' : 'thirdparty/dropzone/dropzone-amd-module.min',
    'jquery' : 'thirdparty/jquery/jquery.min',
    'text' : 'thirdparty/requireJS/text',
    'backbone' : 'thirdparty/backbone/backbone-0.9.10',
    'underscore' : 'thirdparty/backbone/underscore-1.4.4',
    'spectrum' : 'thirdparty/spectrum/spectrum'
};
var shim = {
    'backbone': {
        deps: ['underscore', 'jquery'],
        exports: 'Backbone'
    },
    'spectrum': {
        deps: ['spectrum']
    }
}
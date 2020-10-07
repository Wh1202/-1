//1.开发环境服务器地址
var baseURL = "http://ajax.frontend.itheima.net";
$.ajaxPrefilter(function (params) {
    params.url = baseURL + params.url;
})
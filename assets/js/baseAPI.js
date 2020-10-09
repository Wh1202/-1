// 开发服务器地址
var baseUrl = 'http://ajax.frontend.itheima.net';
// 生产环境地址
// var baseUrl = 'http://ajax.frontend.itheima.net';
// 测试环境地址
// var baseUrl = 'http://ajax.frontend.itheima.net';

//拦截所有ajax请求: get/post/ajax
// 处理参数
$.ajaxPrefilter(function (options) {
    options.url = baseUrl + options.url

    //2.统一为有权限的接口设置headers请求头
    if (options.url.indexOf('/my/') !== -1) {
        options.headers = {
            Authorization: localStorage.getItem('token') || ""
        }
    }
    //3.拦截所有响应，判断身份证认证信息
    options.complete = function (res) {
        if (res.responseJSON.status === 1 && res.responseJSON.message === "身份认证失败") {
            //1.删除本地 token
            localStorage.removeItem("token");
            //2.跳转页面
            location.href = "/login.html";
        }
    }
})
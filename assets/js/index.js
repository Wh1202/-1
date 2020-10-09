$(function () {
    getUserInfo();
    // getUserInfo();
    //2.退出功能
    var layer = layui.layer;
    $('#btnLogout').on('click', function () {
        layer.confirm('确定退出登录?', { icon: 3, title: '提示' }, function (index) {
            //do something
            //1.删除本地存储的token值
            localStorage.removeItem('token')
            //2.跳转login页面
            location.href = '/login.html'
            //3.关闭询问框
            layer.close(index);
        });
    })
});


function getUserInfo() {
    $.ajax({
        method: 'GET',
        url: '/my/userinfo',
        headers: {
            Authorization: localStorage.getItem("token") || ""
        },
        success: function (res) {
            // console.log(res);
            //判断状态码
            if (res.status !== 0) {
                return layui.layer.mag(res.message)
            }
            //请求成功，渲染用户头像信息
            renderAvatatr(res.data)
        },
        //无论成功或失败，都是触发complete方法
        complete: function (res) {
            // console.log(res);
            //判断如果身份认证失败，跳转回登陆页面
            if (res.responseJSON.status === 1 && res.responseJSON.message === "身份认证失败") {
                //1.删除本地 token
                localStorage.removeItem("token");
                //2.跳转页面
                location.href = "/login.html";
            }
        }
    })
}

//封装用户头像渲染函数
function renderAvatatr(user) {
    //1.用户明
    var name = user.nickname || user.username;
    $("#welcome").html("欢迎&nbsp;&nbsp;" + name);
    //2.用户头像
    if (user.user_pic !== null) {
        //有头像
        $(".layui-nav-img").show().attr("src", user.user_pic);
        $(".user-avatar").hide();
    } else {
        //没有头像
        $(".layui-nav-img").hide();
        var text = name[0].toUpperCase();
        $(".user-avatar").show().html(text)
    }
}

//入口函数
$(function () {
    //1.点击去注册账号，隐藏登陆区域。显示注册区域
    $("#link_reg").on("click", function () {
        $(".login-box").hide();
        $(".reg-box").show();
    })
    $("#link_login").on("click", function () {
        $(".login-box").show();
        $(".reg-box").hide();
    })

    //自定义验证规则
    var form = layui.form;
    form.verify({
        //密码规则
        pwd: [
            /^[\S]{6,16}$/,
            "密码必须为6-16位，且不能输入空格"
        ],
        repwd: function (value) {
            //选择器必须带空格，选择的是后代中input，name属性值为password的那一个标签
            var pwd = $(".reg-box input[name=password]").val()
            //比较
            if (value !== pwd) {
                return "两次密码输入不一致！"
            }
        }
    })
    //.注册功能
    var layer = layui.layer;
    $('#form_reg').on('submit', function (e) {
        //1. 阻止默认的提交行为
        e.preventDefault();
        //2.发起ajax的POST请求
        $.ajax({
            method: 'POST',
            url: '/api/reguser',
            data: {
                username: $('.reg-box [name=username]').val(),
                password: $('.reg-box [name=password]').val(),
            },
            success: function (res) {
                if (res.status !== 0) {
                    return alert(res.message)
                }
                //提交成功后处理代码
                layer.msg("注册成功，请登陆！");
                //手动切换到登陆表单
                $("#link_login").click();
                //
            }
        })

    })
    //登陆功能给form标签绑定事件，button按钮触发提交事件
    $("#form_login").on('submit', function (e) {
        //阻止表单提交
        e.preventDefault();
        //发送ajax
        $.ajax({
            method: 'POST',
            url: "/api/login",
            //this指向function函数绑定的事件源
            data: $(this).serialize(),
            success: function (res) {
                //验证返回状态
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                //提示信息，保存token跳转页面
                layer.msg("恭喜您，登陆成功")
                //保存token，未来的接口使用token
                localStorage.setItem("token", res.token);


                //跳转到大事件首页
                location.href = "/index.html"
            }
        })
    })
})
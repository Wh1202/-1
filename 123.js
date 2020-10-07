$(function () {
    $("#link-reg").on('click', function () {
        $(".login-box").hide();
        $('.reg-box').show()
    })
    $("#link-login").on('click', function () {
        $(".login-box").show();
        $('.reg-box').hide()
    })

    //2.自定义表单验证
    //获取form对象
    var form = layui.form;
    //验证规则
    form.verify({
        // unm: [/^[\w]{6,8}$/, '用户名必须6-8位之间,且只能有字母、数字和下划线'],
        pwd: [
            /^[\S]{6,12}$/
            , '密码必须6到12位，且不能出现空格'
        ],
        repwd: function (value) {
            //形参value获取的是确认密码框的内容
            //还需要获取密码框中的内容
            var pwd = $(".reg-box [name=password]").val();
            if (pwd !== value) {
                return "两次密码输入不一致!"
            }
        }
    })

    //3.注册功能
    //优化消息提示框
    var layer = layui.layer;
    $('#form_reg').on('submit', function (e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/api/reguser',
            data: {
                username: $('.reg-box [name=username]').val(),
                password: $('.reg-box [name=username]').val(),
            },
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                layer.msg('恭喜您,用户注册成功!')
                //注册成功后自动点击登录功能
                $('#link-login').click();
            }
        })
    })

    //4.登录功能
    $('#form_login').on('submit', function (e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/api/login',
            //this指向function函数绑定的事件源
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                layer.msg('恭喜您,登录成功!')
                //保存token值在localstorage
                localStorage.setItem('token', res.token)
                //跳转到大事件首页
                location.href = '/index.html'
            }
        })
    })
})
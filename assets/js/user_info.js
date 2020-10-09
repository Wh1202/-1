$(function () {
    //1.自定义验证
    var form = layui.form;
    form.verify({
        nickname: function (value) {
            if (value.length > 6) {
                return "昵称的长度为1~16之间"
            }
        }
    })
    //2.初始化用户信息
    inutUserInfo();
    function inutUserInfo() {
        $.ajax({
            url: '/my/userinfo',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                console.log(res);
                //成功后渲染
                form.val('formUserinfo', res.data);
            }
        })
    }
    //3.表单重置
    $("#btnReset").on("click", function (e) {
        //阻止重置
        e.preventDefault();
        //从新用户渲染
        inutUserInfo()

    })
    //4.修改用户信息
    $(".layui-form").on("submit", function (e) {
        //阻止提交
        e.preventDefault();
        //发送ajax()
        $.ajax({
            method: 'POST',
            url: '/my/userinfo',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                //成功
                layer.msg("恭喜您，修改用户信息成功！");
                console.log(res);
                //调用父框架的全局方法
                window.parent.getUserInfo()
            }
        })
    })
})
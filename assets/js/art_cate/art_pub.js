$(function () {
    //1.初始化分类
    var form = layui.form;//导入form
    var layer = layui.layer;//导入layer
    initCate();//调用函数
    //封装
    function initCate() {
        $.ajax({
            method: "GET",
            url: "/my/article/cates",
            success: function (res) {
                //校验
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                //赋值，渲染form
                var htmlStr = template("tpl-cate", res)
                $("[name=cate_id]").html(htmlStr);
                form.render();

            }
        })
    }

    // 初始化富文本编辑器
    initEditor()
    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)

    //4.点击按钮  选择图片
    $("#btnChooseImage").on("click", function () {
        $("#coverFile").click();
    })

    //监听 coverFile 的change 事件，获取用户选择的文件列表
    $('#coverFile').on('change', function (e) {
        //获取到文件的列表数组
        var file = e.target.files[0]
        //判断是否选择了文件  (非空校验)！
        if (file == undefined) {
            return layer.msg("请选择文件")
        }
        //根据选择文件，创建一个对应的URL地址
        var newImgURL = URL.createObjectURL(file)
        //先销毁旧的裁剪区域，再重新设置图片路径，之后常见新的裁剪区域；
        $image
            .cropper('destroy')      // 销毁旧的裁剪区域
            .attr('src', newImgURL)  // 重新设置图片路径
            .cropper(options)        // 重新初始化裁剪区域
    })

    //设置状态
    var state = "已发布";
    $("#btnSave2").on("click", function () {
        state = "草稿";
    })



    //为表单绑定 submit 提交事件
    $("#form-pub").on('submit', function (e) {
        //1.组织表单的默认行为
        e.preventDefault()
        //2.基于form表单，快速创建一个 ForData 对象
        var fd = new FormData(this);
        //放入形态
        fd.append("state", state);
        //放入图片
        $image.cropper("getCroppedCanvas", {
            width: 400,
            heigth: 280
        }).toBlob(function (blob) {
            //得到文件对象后，惊醒后续的操作
            fd.append('cover_img', blob);
            // 发送 ajax 要在toblob()函数里面！！
            publishArticle(fd);
        })
    })

    function publishArticle(fd) {
        $.ajax({
            method: 'POST',
            url: '/my/article/add',
            data: fd,
            contentType: false,
            processData: false,
            success: function (res) {
                //判断
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                layer.msg('恭喜您，发布文章成功！ 跳转中');
                setTimeout(function () {
                    window.parent.document.querySelector("#art_list").click();
                }, 1200)
            }
        })
    }
})
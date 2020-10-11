$(function () {
    //1.定义查询参数
    var q = {
        pagenum: 1,//页码值
        pagesize: 2,//每页显示多少条数据
        cate_id: "",//文章分类的Id
        state: "",//文章的状态，可选择值有：已发布草稿
    };
    // 初始化文章列表
    initTable();
    function initTable() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function (res) {
                var str = template('tpl-table', res);
                $('tbody').html(str);
                //分页
                renderPage(res.total)
            }
        })
    }

    // 美化事件过滤器
    template.defaults.imports.dataFormat = function (date) {
        var dt = new Date(date);
        var y = dt.getFullYear()
        var m = padZero(dt.getMonth() + 1)
        var d = padZero(dt.getDate())

        var hh = padZero(dt.getHours())
        var mm = padZero(dt.getMinutes())
        var ss = padZero(dt.getSeconds())

        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss;
    }

    // 定义补零函数
    function padZero(n) {
        return n > 9 ? n : '0' + n;
    }


    //初始化分类下拉菜单
    initCate()
    var form = layui.form;
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                var htmlStr = template('tpl-cate', res)
                $('[name=cate_id]').html(htmlStr)
                //因为模版引擎渲染的是section内容,页面显示的是dl中的内容,layui获取不到dl中的内容会默认没有选项,自动给section中添加一个选项
                form.render()
            }
        })
    }

    //筛选功能
    $("#form-search").on("submit", function (e) {
        e.preventDefault();
        //获取
        var state = $("[name=state]").val();
        var cate_id = $("[name=cate_id]").val();
        //赋值
        q.state = state;
        q.cate_id = cate_id;
        //初始化文章列表
        initTable();
    })

    //定义渲染分页的方法
    function renderPage(total) {
        console.log(total);
    }

    //分页函数
    var laypage = layui.laypage;
    function renderPage(total) {
        //执行一个laypage实例
        laypage.render({
            elem: 'pegBox',//注意这里的 test1 是 ID
            count: total,//数据总数，从服务端得到
            limit: q.pagesize,//每页几条
            curr: q.pagenum,//第几页
            //触发jump ：分页初始化的时候，页码改变的时候
            //分页模式设置，显示那些字模块
            layout:['count','limit','prev', 'page', 'next','skip'],
            jump: function (obj, first) {
                //obj：所有参数所在的对象；first：是否是第一次初始化分页；
                //改变当前页
                q.pagenum = obj.curr;
                q.pagesizi = obj.limit;
                //判断，不是第一次初始化分页，才能重新调用初始化文章列表
                if (!first) {
                    //初始化文章列表
                    initTable();
                }
            }
        })
    }

    //删除
    var layer = layui.layer;
    $("tbody").on("click", ".btn-delete", function () {
        //   ！！ 先获取Id，进入到函数中this代指就改变了
        var Id = $(this).attr("data-id");
        //显示对话框
        layer.confirm('是否确认删除？', {icon: 3, title:'提示'}, function(index){
            //do something
            $.ajax({
                method: 'GET',
                url: '/my/article/delete/' + Id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg(res.message)
                    }
                        //因为我们更新成功了，所以要重新渲染页面中的数据
                        initTable();
                        layer.msg("恭喜您，文章删除成功")
                        //页面汇总删除按钮个数等于1，页码大于1；
                        if ($(".btn-delete").length == 1 && q.pagenum > 1) q.pagenum--;
                    }
                
            })
            layer.close(index);
          });
    })

})
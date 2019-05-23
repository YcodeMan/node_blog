$(() => {
    // textarea随文字的增加,自动加高
    $(".input_textarea").each(function () {
        this.style.height = this.scrollHeight + 'px';
    });
    $(".input_textarea").bind({
        input: function () {
            this.style.height = this.scrollHeight + 'px';
        }

    })

    // 验证addPostForm表单
    $("#addPostForm").validate({
        errorElement: 'span',
        errorClass: 'help-block',
        submitHandler: function (form) {
            var title = $("#article-title").val(),
                author = $("#article-author").val(),
                category = $("#article-category").val(),
                intro = $("#article-intro").val(),
                content = $("#article-content").val() 
               
            $.ajax({
                url: './addArticle',
                type: 'post',
                data: {
                    title,
                    author,
                    category,
                    intro,
                    content
                },
                dataType: 'json',
                success(res) {
                    var code = res.errorCode
                    $('#myModal').modal()
                    $('#myModal .modal-body').html(res.msg)
                    setTimeout(function () {
                        if (code == 200) {
                        location.href = '../'
                        } else {
                         location.reload()
                        }
                    }, 2000)
                },
                error(jqXhr) {
                    $('#myModal').modal()
                    $('#myModal .modal-body').html('网络错误')
                }
            })
            return false
        },
        rules: {
            title: "required",
            author: 'required',
            category: 'required',
            intro: {
                required: true,
                minlength: 8
            },
            content: {
                required: true,
                minlength: 50
            }
        },
        messages: {
            title: "请输入标题",
            author: "请输入作者",
            category: "请输入分类",
            intro: {
                required: "请输入简介",
                minlength: "简介不能小于8个字符"
            },
            content: {
                required: "请输入内容",
                minlength: "内容不能小于50个字符"
            }

        },
        //自定义错误消息放到哪里
        errorPlacement: function (error, element) {
            element.next().remove();//删除显示图标
            element.after('<span class="glyphicon glyphicon-remove form-control-feedback" aria-hidden="true"></span>');
            element.closest('.form-group').append(error);//显示错误消息提示
        },
        //给未通过验证的元素进行处理
        highlight: function (element) {
            $(element).closest('.form-group').addClass('has-error has-feedback');
        },
        //验证通过的处理
        success: function (label) {
            var el = label.closest('.form-group').find("input,textarea");
            el.next().remove();//与errorPlacement相似
            el.after('<span class="glyphicon glyphicon-ok form-control-feedback" aria-hidden="true"></span>');
            label.closest('.form-group').removeClass('has-error').addClass("has-feedback has-success");
            label.remove();
        }
    })

    $('#returnIndex').click(() => {
        location.href = '../../'
    })
})
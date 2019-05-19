$(() => {
    $("#signupForm").validate({
        errorElement: 'span',
        errorClass: 'help-block',
        submitHandler: function (form) {
            var username = $("#username").val(),
                password = $('#password').val()
            $.ajax({
                url: '/users/login',
                type: 'post',
                data: {
                    username,
                    password,
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
            username: "required",
            password: {
                required: true,
                minlength: 6
            }
        },
        messages: {
            username: "请输入用户名",
            password: {
                required: "请输入密码",
                minlength: "密码不能小于5个字符"
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
            var el = label.closest('.form-group').find("input");
            el.next().remove();//与errorPlacement相似
            el.after('<span class="glyphicon glyphicon-ok form-control-feedback" aria-hidden="true"></span>');
            label.closest('.form-group').removeClass('has-error').addClass("has-feedback has-success");
            label.remove();
        }
    })
})
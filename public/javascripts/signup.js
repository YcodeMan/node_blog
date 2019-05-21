$(() => {
    // 匹配密码，以字母开头，长度在6-12之间，必须包含数字和特殊字符。
    jQuery.validator.addMethod("isPwd", function (value, element) {
        var str = value;
        if (str.length < 6 || str.length > 18)
            return false;
        if (!/^[a-zA-Z]/.test(str))
            return false;
        if (!/[0-9]/.test(str))
            return false;
        return this.optional(element) || /[^A-Za-z0-9]/.test(str);
    }, "以字母开头，长度在6-12之间，必须包含数字和特殊字符。")

    $("#signupForm").validate({
        errorElement: 'span',
        errorClass: 'help-block',
        submitHandler: function (form) {
            var username = $("#username").val(),
                password = $('#password').val(),
                email = $('#email').val()
            $.ajax({
                url: '/register',
                type: 'post',
                data: {
                    username,
                    password,
                    email
                },
                dataType: 'json',
                success(res) {
                    var code = res.errorCode
                    $('#myModal').modal()
                    $('#myModal .modal-body').html(res.msg)
                    setTimeout(function () {
                        if (code == 200) {
                            location.href = '/sign_in'
                        } else {
                            location.href = '/sign_up'
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
            email: {
                required: true,
                email: true
            },
            password: {
                required: true,
                isPwd: true
            },
            confirm_password: {
                required: true,
                isPwd: true,
                equalTo: "#password"
            }
        },
        messages: {
            username: "请输入用户名",
            email: {
                required: "请输入Email地址",
                email: "请输入正确的email地址"
            },
            password: {
                required: "请输入密码",
                minlength: "密码不能小于6个字符"
            },
            confirm_password: {
                required: "请输入确认密码",
                minlength: "确认密码不能小于6个字符",
                equalTo: "两次输入密码不一致"
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
    });
})
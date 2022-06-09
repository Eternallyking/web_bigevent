$(function () {
    $('#link_reg').click(() => {
        $('.login-box').hide();
        $('.reg-box').show();
    })
    $('#link_login').click(() => {
        $('.login-box').show();
        $('.reg-box').hide();
    })
    const form = layui.form;
    form.verify({
        password: [/^[\S]{6,12}$/, "密码必须6到12位，且不能出现空格"],
        repwd: (value) => {
            const pwd = $('.reg-box [name=password]').val();
            // console.log(pwd,value);
            if (pwd !== value) return "两次密码不一致"
        }
    });
    // const baseUrl = "http://www.liulongbin.top:3007"
    $('#form_reg').submit((e) => {
        e.preventDefault();
        $.ajax({
            type: "POST",
            url: "/api/reguser",
            data: {
                username: $('#form_reg [name=username]').val(),
                password: $('#form_reg [name=password]').val(),
            },
            success: (res) => {
                console.log(res);
                if (res.status !== 0) return layer.msg(res.message);
                layer.msg('注册成功!')
                $('#link_login').click()
            }
        })
    })
    $('#form_login').submit(function (e) {
        e.preventDefault();
        $.ajax({
            type: 'POST',
            url: '/api/login',
            data: $(this).serialize(),
            success: (res) => {
                if (res.status !== 0) return layer.msg(res.message)
                layer.msg('登录成功!')
                localStorage.setItem('token', res.token)
                location.href = '/index.html'
            }
        })
    })
})
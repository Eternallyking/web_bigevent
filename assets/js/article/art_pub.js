$(function () {
    const form = layui.form
    // 初始化富文本编辑器
    initEditor()
    const initCate = () => {
        $.ajax({
            type: 'GET',
            url: '/my/article/cates',
            success: (res) => {
                if (res.status !== 0) return layer.msg('获取文章分类失败')
                const htmlStr = template('tpl-cate', res)
                $('[name=cate_id]').html(htmlStr)
                form.render('select')
            }
        })
    }
    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)
    $('#btnChooseImage').click(() => {
        $('#coverFile').click()
    })
    $('#coverFile').change((e) => {
        const filelen = e.target.files.length
        if (filelen === 0) return
        const file = e.target.files[0]
        const imgUrl = URL.createObjectURL(file)
        // 为裁剪区域重新设置图片
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', imgUrl) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域
    })
    let art_state = '已发布'
    $('#btnSave1').click(() => {
        art_state = '已发布'
    })
    $('#btnSave2').click(() => {
        art_state = '草稿'
    })
    $('#form-pub').submit(function (e) {
        e.preventDefault()
        const fd = new FormData($(this)[0])
        fd.append('state', art_state)
        // console.log(fd.get('title'));
        // console.log(fd.get('cate_id'));
        // console.log(fd.get('content'));
        // console.log(fd.get('state'));
        // 4. 将封面裁剪过后的图片，输出为一个文件对象
        $image
            .cropper('getCroppedCanvas', {
                // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function (blob) {
                // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                // 5. 将文件对象，存储到 fd 中
                fd.append('cover_img', blob)
                // 6. 发起 ajax 数据请求
                publishArticle(fd)
            })
    })
    const publishArticle = (fd) => {
        $.ajax({
            type: 'POST',
            url: '/my/article/add',
            data: fd,
            contentType: false,
            processData: false,
            success: (res) => {
                if (res.status !== 0) return layer.msg('发布文章失败');
                layer.msg('发布文章成功');
                // 发布文章成功后，跳转到文章列表页面
                location.href = '/article/art_list.html'
                window.parent.change()
            }
        })
    }
    initCate()
})
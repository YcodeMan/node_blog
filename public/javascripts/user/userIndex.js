$(() => {
    $('#addPost').click(() => {
       // 跳转当前路由下的posts/addPost地址
       var url = location.href
      if (url.charAt(location.href.length-1) == '/') {
        location.href += 'posts/addPost'
      } else {
        location.href += '/posts/addPost'
      }
         
    })
})
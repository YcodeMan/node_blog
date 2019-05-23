$(() => {
    var url = location.href
      if (url.charAt(url.length - 1) == '/') {
        location.href = url.substring(0, url.length - 1)
      } 
    $('#addPost').click(() => {
        location.href += '/posts/addPost' 
    })
    $('.psotClass').click(function() {
        var id = $(this).attr('data-id')
        location.href += '/posts/' + id
    })
})
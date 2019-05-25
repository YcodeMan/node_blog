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
        console.log(this)
        location.href += '/posts/' + id
    })
    $('.psotClass').on('click', '#update', function() {
      var id = $('.psotClass').attr('data-id')
      location.href += '/posts/' + id + '/edit'
      return false
    })
    $('.psotClass').on('click', '#del', function() {
      var id = $('.psotClass').attr('data-id')
      $.ajax({
        url: location.href += '/posts/' + id + '/del',
        type: 'get',
        success(res) {
          if (res.errorCode == 200) {
            location.href = './'
          }
        }
      })
      return false
    })
})
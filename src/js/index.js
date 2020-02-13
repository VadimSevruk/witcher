$('.copy__button').click(function() {
    let t = $('.copy__text').text();
    $("body").append('<input>');
    $('input').val(t);
    $('input').select();
    document.execCommand("copy");
    $('input').remove();
})
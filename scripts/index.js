$(document).ready(()=>{
    // Copy import
    $('.copycode').click(function() {
        var $elem = $(this),
            text = $('.code').text(),
            tempCopy = $('<input>').val(text).appendTo('body').select();
        document.execCommand('copy');
        tempCopy.remove();
        $elem.text('Copied!');
        setTimeout(() => {
            $elem.text('Copy');
        }, 1500);
    });
});
$(function () {
    $('[data-toggle="tooltip"]').tooltip();
    
    $('input').focus(function(){
	$(this).removeClass('input-error');
    });

});

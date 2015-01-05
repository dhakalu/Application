$(function () {
    $('[data-toggle="tooltip"]').tooltip();
    
    $('input').focus(function(){
	$(this).removeClass('input-error');
	$(this).next('div').remove();
    });

    var validateForm =  function(){
	var required_fields = this.find('input[required=True]')
    };
});

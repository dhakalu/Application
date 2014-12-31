$(document).ready(function(){
    $('#login:text:first').focus();
    
    // Submit Script
    $('#login').submit(function(event){
	$('#login_status').html("Loading..");
	event.preventDefault();
	var formData = $('#login').serialize();
	console.log(formData);
	$.ajax({
	    url: '/login',
	    type: 'POST',
	    data: formData,
	    dataType: 'json'
	}).done(function(data){
	    if (data.status == 'ERR'){
		console.log(data);
		var errorHtml = '<div class="text-error"><b>';
		if (data.name_error){
		    errorHtml += data.name_error;
		} else if (data.password_error){
		    errorHtml += data.password_error;
		}
		errorHtml += '</b></div>';
		$('#login_status').html(errorHtml);		
	    }else if(data.status == 'OK'){
		$(location).attr('href','/resume');
	    }
	});
    });
});

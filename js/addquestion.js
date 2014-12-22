$(document).ready(function(){
    $('#add_question_bttn').click(function(){
	var question = $('#question').val();
	var choice1= $('#choice-1').val();
	var choice2= $('#choice-2').val();
	var choice3= $('#choice-3').val();
	var choice4= $('#choice-4').val();
	if (question == '' || choice1 == '' || choice2 == ''
	    || choice3 == '' || choice4 == ''){
	    alert("Please Fill all the fields first");
	}else{
	    $.ajax({
		
	    });
	}
    });
});



var questions = [['How many days are there in a week?',[2,4,7,6],7],
	     ['What does comida mean?' ,['food', 'drinks', 'to eat', 'to walk'], '               food'],
	     ['What does tres mean', [1, 2, 3 ,4], 3],
            ];

var curr_question = 0;
var num_question = questions.length;
var score = 0;

function show_question(){
     $('#question').html(questions[curr_question][0]);
     var options = questions[curr_question][1];
     
     $('#opt_1').val(options[0]);
     $('#ans_1').html(options[0]);
     $('#opt_2').val(options[1]);
     $('#ans_2').html(options[1]);
     $('#opt_3').val(options[2]);
     $('#ans_3').html(options[2]);
     $('#opt_4').val(options[3]);
     $('#ans_4').html(options[3]);
   }

function next_question(){
    curr_question += 1;
    curr_question = curr_question % num_question;
    show_question();
}

function prev_question(){
    console.log("called!");
    curr_question--;
    if (curr_question < 0){
        curr_question = 0;
    }   
    console.log(curr_question);
    show_question();
}

function update_score(){
    score += 1;
    show_score();
}

function show_score(){
    $('#score').html('Your score is: ' + score );
}

function validate_answer(){
    var user_choices = document.getElementsByName('answer');
    var user_choice;
    for (var i = 0; i < user_choices.length; i++){
	if (user_choices[i].checked){
            user_choice = user_choices[i].value;
	}
    }
    console.log('called');
    if (user_choice == questions[curr_question][2]) {
	$('#feed_back').html('You got it right!');
	update_score();
    } else if (!user_choice) {
	$('#feed_back').html('Please select a respone FIRST!');
    } else {
	$('#feed_back').html('You are an absolute dumb!!');
    }
}

$(document).ready(function(){
    show_question();
    $('#next_bttn').click(function(){
	$('#feed_back').html('');
	next_question();
    });
    
    //Call the previous function when previous
    // button is clicked
    $('#prev_bttn').click(function(){
	$('#feed_back').html('');
	prev_question();
    });
    
    // submit the answer when the submit bttn 
    // is clicked
    $('#ans_submit_bttn').click(function(){
	validate_answer();
    });
});


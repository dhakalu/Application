 $(document).ready(function(){                                 
     $("#login :text:first").focus();                         
     $("body").css("background-color", "#006666");                  
     
     // Submit script
     $("#signup").submit(function(event){
	 event.preventDefault();
	 var formData = $("#signup").serialize();
	 $.ajax({
	     type : "POST",
	     url : "/signup",
	     data : formData,
	     dataType : "json"
	 })
	     .done(function(data){
		 var result = data.result;
		 var status = data.status;
		 if (status == 'ERR'){
		     var emailErr = result.email_error;
		     if (emailErr){
			 $('#email_container').addClass("has-error");
			 var $errorDiv = $('<div class="input-error"><p class="text-error"></p></div>');
			 $errorDiv.find('.text-error').text(emailErr);
			 $('#email_container').append($errorDiv);
		     }
		     var userErr = result.user_name_error;
		     if (userErr){
			 $('#username_container').addClass("has-error");
			 var $userErrDiv = $('<div class="input-error"><p class="text-error"></p></div>');
			 $userErrDiv.find('.text-error').text(userErr);
			 $('#username_container').append($userErrDiv);
		     }
		     var passwordErr = result.password_error;
		     if (passwordErr) {
			 console.log(passwordErr);
		     }
		 }else{
		     $(location).attr('url','/resume');
		 }	
	     }); // end of ajax request
     }); // end of submit 
     
     // Validation of the signup form                              
     $('#signup').validate({
	 rules : {
	     first_name : 'required',
	     last_name : 'required',
	     user_name : 'required',
	     email : {
		 required : true,
		 email : true
	     },
	     email_confirm : {
		 equalTo : '#email'
	     },
	     password : 'required'
	 },  // end of rules
	 messages : {
	     first_name : {
		 required : "First name is a required field."
	     },
	     last_name : {
		 required : "Last name is a required field."
	    },
	     user_name : "User name is a required field.",
	     email : {
		 required :"Email is a required field." ,
		 email: "Please Enter a valid email."
	     },
	     email_confirm : {
		 equalTo : "Emails did not match "
	     },
	    password : {
		required : "Password is required"
	    }
	 } // end of messages
     }); // end of validation
 });

$(document).ready(function(){
    
    function loadPage(){
	var old_data = {
	    'award': 0,
	    'education': 0,
	    'publication': 0
	};
	$.ajax({
	    url: '/resume_json',
	    type: 'GET',
	    dataType: 'json'
	}).done(function(data){
	    console.log(data);
	    var results = data.results;
	    var awards = results.awards;
	    var education = results.education;
	    var publications = results.publications;
	    
	    // load all awards
	    for (var i = old_data.award; i < awards.length; i++){
		
	    }

	    // locd all education
	    for (var i = old_data.education; i < education.length; i++){
		var $new_edu = $($('#education_frame').html());
		$new_edu.find('.institution').text(education[i].institution);
		$new_edu.find('.edit_btn').button({
		    icons: {
			primary : "ui-icon-pencil"
		    }
		});
		var majorHtml = "";
		for (var j=0; j<education[i].majors.length; j++){
		    majorHtml += '<span>' + education[i].majors[j] + '</span>';
		}
		console.log(majorHtml);
		$new_edu.find('.majors').append($(majorHtml));
		$new_edu.find('.gpa').text("Cool");
		var coursesHtml = "";
		for ( var j=0; j<education[i].courses.length; j++){
		    coursesHtml += '<button class="option-box">'+education[i].courses[j]+'</button>';
		}
		$new_edu.find('.courses').append($(coursesHtml));
		$('#edu_details').prepend($new_edu);
	    }

	    // load all publications
	    for (var i = old_data.publication; i < publications.length; i++){
		
	    }
	});
    }

    setInterval(loadPage(), 3000);
    
    $('#self_add').hide();
    if ($('#self_details').is(':empty')){
	$('#edit_self_bttn').text('Add Summary');
    } else {
	$('#edit_self_bttn').text('Edit Summary');
    }
    $('#edit_self_bttn').button().click(function(){
	$(this).hide();
	if ($('#self_details').is(':empty')){
	    $('#self_add').slideDown();
	}else{
	    $('#self_add').slideDown();
	    $('#self_summary').val($.trim($('#self_details').text()));
	    $('#self_details').html('');
	}
    });

    // Add Education 
    $('#add_edu').dialog({
	dialogClass: "no-close",
	autoOpen: false,
	modal: true,
	draggable: false,
	dialogClass: 'form-dialog no-close',
	buttons: [
	     {
		 text: "Add",
		 icons: {
		     primary: "ui-icon-plus"
		 },
		 click : function(){
		     var formData = $('#add_edu_form').serialize();
		     $.ajax({
			 url: '/updateresume',
			 type: 'POST',
			 data: formData,
			 dataType: 'json'
		     }).done(function(data){
			 if (data.status){
			     console.log(data);
			    $('#edu_details').prepend('<div>'+data+'</div>');
			 }
		     });
		 }
	     },
	     {
		 text: "Cancel",
		 icons: {
		     primary: "ui-icon-close"
		 },
		 click: function() {
		     $( this ).dialog( "close" );
		 }
	     }
	     
	 ]
    });

    // Add Work Dialog Box
    $("#add_work_dialog").dialog({
	
	draggable: false,
	resizeable: false,
	modal: true,
	autoOpen: false,
	dialogClass: 'form-dialog no-close',
	buttons: [
	    {
		text: "Add",
		icons: {
		    primary: "ui-icon-plus"
		},
		click : function(){
		    var formData = $('#add_work_form').serialize();
		    console.log(formData);
		    $.ajax({
			url: '/updatework',
			type: 'POST',
			data: formData,
			dataType: 'json'
		    }).done(function(data){
			console.log(data);
		    });
		}
	    },
	    {
		text: "Cancel",
		icons: {
		    primary: "ui-icon-close"
		},
		click: function(){
		    $(this).dialog('close');
		}
	    }
	]
    });

    // Add award dialog box
    $('#award_form').dialog({
	autoOpen: false,
	modal: true,
	draggable: false,
	resizeable: false,
	dialogClass: 'form-dialog no-close',
	buttons : [
	    {
		text: "Add",
		icons: {
		    primary: "ui-icon-plus"
		},
		click: function(){
		    var formData = $('#add_award').serialize();
		    formData += '&details=';
		    formData += $('#award_details').val();
		    console.log(formData);
		    $.ajax({
			url: '/updateaward',
			type: 'POST',
			data: formData,
			dataType: 'json'
		    }).done(function(data){
			console.log(data);
		    });
		}
	    },
	    {
		text: "Cancel",
		icons: {
		    primary: "ui-icon-close"
		},
		click: function(){
		    $(this).dialog('close');
		}
	    }
	]
    });

    // add publication dialog box
    
    $('#add_publication').dialog({
	draggable: false,
	resizeable: false,
	autoOpen: false,
	modal: true,
	dialogClass: 'form-dialog no-close',
	buttons: [
	    {
		text: "Add",
		icons: {
		    primary: "ui-icon-plus"
		},
		click: function(){
		    var formData = $('#add_public_form').serialize();
		    console.log(formData);
		    $.ajax({
			url: "/updatepublication",
			type: 'POST',
			data: formData,
			dataType: 'json'
		    }).done(function(data){
			console.log(data);
		    });
		}
	    },
	    {
		text: "Canel",
		icons: {
		    primary: "ui-icon-close"
		},
		click: function(){
		    $(this).dialog('close');
		}
	    }
	]   
    });

    $('#resume_accordion').accordion({
	heightStyle: "content"
    }); // end of qccordion
    
    $('#add_education').button({
	icons : {
	    primary : "ui-icon-plus"
	}
    }).click(function(){

	$("#add_edu").dialog('open');
    });// end of add education 

    // Add Work Button
    $('#add_work').button({
	icons :{
	    primary: "ui-icon-plus"
	}
    }).click(function(){
	$('#add_work_dialog').dialog('open');
    });

    $('#add_award_btn').button({
	icons: {
	    primary: "ui-icon-plus"
	}
    }).click(function(){
	$('#award_form').dialog('open');
    });

    $('#add_publication_bttn').button({
	icons: {
	    primary: "ui-icon-plus"
	}
    }).click(function(){
	$('#add_publication').dialog('open');
    });

    $('#add_section_bttn').button({
	icons: {
	    primary: "ui-icon-plus"
	}
    }).click(function(){
    });
}); // end of ready function

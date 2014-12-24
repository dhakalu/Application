$(document).ready(function(){
    loadPage();
    
    function loadPage(){
	var old_data = {
	    'award': 0,
	    'education': 0,
	    'publication': 0,
	    'work' : 0
	};
	var old_self_summary = '';
	$.ajax({
	    url: '/resume_json',
	    type: 'GET',
	    dataType: 'json'
	}).done(function(data){
	    console.log(data);
	    var results = data.results;
	    var awards = results.awards;
	    var education = results.education;
	    var works = results.works;
	    var publications = results.publications;
	    var self_summary = results.summary;
	    // load all awards
	    for (var i = old_data.award; i < awards.length; i++){
		var this_award = awards[i];
		var award_html_str = $('#award_frame').html();
		var $new_award = $(award_html_str);
		$new_award.find('.title').text(this_award.title);
		var $edit_btn = $('<button class="edit_btn"></button>').button({
		    icons: {
			primary: "ui-icon-pencil"
		    }

		});
		$new_award.find('.edit').html($edit_btn);
		$new_award.find('.details').text(this_award.details);
		console.log($new_award.html());
		$('#award_details').prepend($new_award);
	    }

	    // Load self Summary
	    if (old_self_summary != self_summary.summary){
		console.log("Diffrent");
		var $new_summary = $($('#summary_frame').html());
		$new_summary.find('.summary').text(self_summary.summary);
		$('#self_details').html($new_summary);
	    }
	    
	    // load all education
	    for (var i = old_data.education; i < education.length; i++){
		var this_edu = education[i];
		var this_institution = this_edu.institution;
		var this_degree = this_edu.degree;
		var this_courses = this_edu.courses;
		var this_majors = this_edu.majors;
		var this_gpa = this_edu.gpa;
		var this_graduation = this_edu.graduation;
		var edu_html_str = $('#education_frame').html();
		var $new_edu = $(edu_html_str);
		$new_edu.find('.institution').html(this_institution);
		var $edit_btn = $('<button class="edit_btn"></button>').button({
		    icons : {
			primary: "ui-icon-pencil"
		    }
		});
		$new_edu.find('.edit').html($edit_btn);
		$new_edu.find('.degree').text(this_degree);
		var majorHtml = '';
		for (var j=0; j<this_majors.length; j++){
		    majorHtml += this_majors[j] + ' ';
		}
		$new_edu.find('.majors').text(majorHtml);
		$new_edu.find('.gpa').text(this_gpa);
		$new_edu.find('.graduation').text(this_graduation);
		var coursesHtml = '';
		for (var j=0; j<this_courses.length; j++){
		    coursesHtml +='<button class="option-box">' +  this_courses[j] + '</button>';
		}
		$new_edu.find('.courses').html($(coursesHtml));
		$('#edu_details').prepend($new_edu);

	    }// end of loading education
	   
	     for (var i = old_data.publication; i<publications.length; i++){
		var this_pub = publications[i];
		var pub_html_str = $('#publication_frame').html();
		var $new_pub = $(pub_html_str);
		$new_pub.find('.title').text(this_pub.title);
		var $edit_btn = $('<button class="edit_btn"></button>').button({
		    icons: {
			primary: "ui-icon-pencil"
		    }

		});
		$new_pub.find('.edit').html($edit_btn);
		$new_pub.find('.authors').text(this_pub.authors);
		$('#publications_details').prepend($new_pub);
	    } // end of loading publictaions

 
	    // load all works
	    for (var i = old_data.work; i< works.length; i++){
		var this_work = works[i];
		var work_html_str = $('#work_frame').html();
		var $new_work = $(work_html_str);
		$new_work.find('.title').text(this_work.title);
		var $edit_btn = $('<button class="edit_btn"></button').button({
		    icons: {
			primary: "ui-icon-pencil"
		    }
		});
		$new_work.find('.edit').html($edit_btn);
		$new_work.find('.employer').text(this_work.employer);
		$new_work.find('.duration').text(this_work.start_date + '-' + this_work.end_date);
		$new_work.find('.details').text(this_work.details);
		$('#work_details').prepend($new_work);
	    }// end of loading work 
	    
	   old_data.work = works.length;
	   old_data.publication = publications.length;
	   old_data.award = awards.length;
	   old_data.education = education.length;
	});// end of ajax request
    }// end of load page

    
    // Add Self Summary
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
	    $('#self_summary_btn').val('Done');
	    $('#self_details').html('');
	}
    });

    $('#self_add_form').submit(function(event){
	event.preventDefault();
	var formData = $('#self_add_form').serialize();
	console.log(formData);
	$.ajax({
	    url: '/updateselfsummary',
	    type: 'POST',
	    data: formData,
	    dataType: 'json'
	})
	.done(function(data){
	    $('#self_add').hide();
	    $('#self_add_form')[0].reset();
	    loadPage();
	}); // end of selfsummary update request
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
			     loadPage();
			   $(this).dialog('colse');
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
		    console.log(formData);
		    $.ajax({
			url: '/updatework',
			type: 'POST',
			data: formData,
			dataType: 'json'
		    }).done(function(data){
			loadPage();
			$(this).dialog('close');
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
			loadPage();
			$(this).dialog('close');
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
			loadPage();
			$(this).dialog('close');
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

    // Date picker
    $('.date-input').datepicker({
	changeMonth: true,
	changeYear: true,
	minDate : '-120y'
    });
    
}); // end of ready function



/*
  All form validations goes here!
 
 */

//Validate self_add_formOB


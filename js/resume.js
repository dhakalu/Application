$(document).ready(function(){
    var model = {
	old_data : {
	    'award': 0,
	    'education': 0,
	    'publication': 0,
	    'work' : 0
	},
	old_self_summary : '',
	get_json : function(){
	    $.ajax({
		url: '/resume_json',
		type: 'GET',
		dataType: 'json'
	    }).done(function(data){
		octupus.updatePage(data, model.old_data, model.old_self_summary);
	    });
	}
    };
    
    var educationView = {
	init : function(education, old_data){
	     for (var i = old_data.education; i < education.length; i++){
		 var this_edu = education[i];
		 educationView.render(this_edu);
		 }
	    
	    },
	render: function(this_edu){
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
	}
    };

    var awardView = {
	init : function(awards, old_data){
	    for (var i = old_data.award; i < awards.length; i++){
		var this_award = awards[i];
		awardView.render(this_award);
	    }
	},
	render: function(this_award){
	    var award_html_str = $('#award_frame').html();
	    var $new_award = $(award_html_str);
	    $new_award.find('.title').text(this_award.title);
	    var $edit_award_btn = $('<button class="edit_btn edit_award_btn"></button>').button({
		icons: {
		    primary: "ui-icon-pencil"
		}
	    });
	    $new_award.find('.edit').html($edit_award_btn);
	    $new_award.find('.details').text(this_award.details);
	    $('#award_details').prepend($new_award);
	}
	
    };
    
    var publicationView = {
	init : function( publications,old_data){
	      for (var i = old_data.publication; i<publications.length; i++){
		  var this_pub = publications[i];
		  publicationView.render(this_pub);
		}
	},
	render: function(this_pub){
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
	    } 

    };
    
    var workView = {
	init: function(works, old_data){
	    for (var i = old_data.work; i< works.length; i++){
		var this_work = works[i];
		workView.render(this_work);
	   } 
	},
	render: function(){
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
	 
	}
    };
    
    var selfSummaryView = {
	init: function(self_summary, old_self_summary){
	    if (old_self_summary != self_summary.summary){
		selfSummaryView.render(self_summary);
	    }
	},
	render: function(self_summary){
	    var $new_summary = $($('#summary_frame').html());
	    $new_summary.find('.summary').text(self_summary.summary);
	    $('#self_details').html($new_summary);
	}
    };      
  
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

    var selfAddFormView = {
	init : function(){
	    var $selfAddDiv = $('#self_add');
	    var $editSelfBttn = $('#edit_self_bttn');
	    var $selfDetails = $('#self_details');
	    // Hide self add form
	    $selfAddDiv.hide();
	    if ($selfDetails.is(':empty')){
		$editSelfBttn.text('Add Summary');
	    }else{
		$editSelfBttn.text('Edit Summary');
	    }
	}
    };

   
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
	}); // end of selfsummary update request
    });
    // Add Education 
    
    var addEducationFormView = {
	init: function(){
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
			 octupus.submitEduAddForm(formData);
			}
		    },
		    {
			text: "Cancel",
			icons: {
			    primary: "ui-icon-close"
			},
			click: function() {
			    $(this).dialog( "close" );
			}
		    } 
		]
	    });
	}
    };
    
    var addWorkFormView = {
	init: function(){
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
			     octupus.submitAddWorkForm(formData);
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
	}
    };
    
    var addAwardFormView = {
	init: function(){
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
			     octupus.submitAddAwardForm(formData);
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
	}
    };
    
    var addPublicationFormView = {
	init : function(){
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
			    octupus.submitAddPublicationForm(formData);
		   
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
	}
    };
    
    var resumeAccordionView = {
	init : function(){
	     $('#resume_accordion').accordion({
		 heightStyle: "content"
	     });
	}
    };
    
    var addEducationButtonView = {
	init :function(){
	    $('#add_education').button({
		icons : {
		    primary : "ui-icon-plus"
		}
	    }).click(function(){
		$("#add_edu").dialog('open');
	    });// end of add education 
	}
    };
    
    var addWorkButtonView = {
	init : function(){
	    $('#add_work').button({
		icons :{
		    primary: "ui-icon-plus"
		}
	    }).click(function(){
		$('#add_work_dialog').dialog('open');
	    });
	}
    };
    
    var addAwardButtonView = {
	init: function(){
	    $('#add_award_btn').button({
		icons: {
		    primary: "ui-icon-plus"
		}
	    }).click(function(){
		$('#award_form').dialog('open');
	    });
	}
    };
    
    var addPublicationButtonView = {
	init : function(){
	    $('#add_publication_bttn').button({
		icons: {
		    primary: "ui-icon-plus"
		}
	    }).click(function(){
		$('#add_publication').dialog('open');
	    });
	}
    };

    var addTechnicalSkillButtonView = {
	init: function(){
	    $('#add_tech_skill_btn').button({
		icons: {
		    primary: "ui-icon-plus"
		}
	    })
	    .click(function(){
		$('#tech_skill_dialog').dialog('open');
	    });
	}
    };
    
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
     // end of ready function

    var addTechnicalSkillFormView = {
	init : function(){
	    $('#tech_skill_dialog').dialog({
		title : 'Add your skill',
		autoOpen: false,
		modal: true,
		dialogClass: 'no-colse form-dialog',
		resizeable: false,
		draggable: false,
		minWidth: 400,
		buttons: [
		    {
			text: "Add",
			icons: {
			    primary: "ui-icon-plus"
			},
			click : function(){
			    var formData = $('#add_technical_skills').serialize();
			    octupus.submitAddTechnicalSkillForm(formData);
			}
		    }
		]
	    });
	   $('#skill_level').buttonset();
	}
    };

    var technicalSkillView = {
	init : function(json_data){
	}
    };

    var octupus = {
	init: function(){
	    setInterval( model.get_json(), 3000);
	    resumeAccordionView.init();
	    // initialize the forms
	    addEducationFormView.init();
	    addPublicationFormView.init();
	    addWorkFormView.init();
	    addAwardFormView.init();
	    addTechnicalSkillFormView.init();
	    selfAddFormView.init();
	    // initialize the buttons
	    addEducationButtonView.init();
	    addWorkButtonView.init();
	    addAwardButtonView.init();
	    addPublicationButtonView.init();
	    addTechnicalSkillButtonView.init();
	    //initialize validations
	    
	},
	submitAddTechnicalSkillForm: function(formData){
	    $.ajax({
		url: '/updatetechnicalskill',
		type: 'POST',
		data: formData,
		dataType: 'json'
	    })
		.done(function(data){
		    technicalSkillView.init(data);
		});
	},
	submitEduAddForm: function(formData){
	    $.ajax({
		url: '/updateresume',
		type: 'POST',
		data: formData,
		dataType: 'json'
	    }).done(function(data){
		if (data.status){
		    $('#add_edu').dialog('close');
		}
	    });
	},
	submitAddWorkForm: function(formData){
	    $.ajax({
		url: '/updatework',
		type: 'POST',
		data: formData,
		dataType: 'json'
	    }).done(function(data){
		$('#add_work_form')[0].reset();
		$('#add_work_dialog').dialog('close');
	    });
	},
	submitAddAwardForm: function(formData){
	    $.ajax({
		url: '/updateaward',
		type: 'POST',
		data: formData,
		dataType: 'json'
	    }).done(function(data){
		$('#add_award')[0].reset();
		$('#award_from').dialog('close');
	    });
	},
	submitAddPublicationForm: function(formData){
	    $.ajax({
		url: "/updatepublication",
		type: 'POST',
		data: formData,
		dataType: 'json'
	    }).done(function(data){
		$('#add_public_form')[0].reset();
		$('#add_publication').dialog('close');
	    });
	},
	updatePage: function(data, old_data, old_self_summary){
	    var results = data.results;
	    var awards = results.awards;
	    var education = results.education;
	    var works = results.works;
	    var publications = results.publications;
	    var self_summary = results.summary;
	    educationView.init(education, old_data);
	    workView.init(works, old_data);
	    awardView.init(awards, old_data);
	    publicationView.init(publications, old_data);
	},
	updateOldData: function(newData){
	    model.old_data = newData;
	},
	validateEducationForm: function(){
	    $('#add_edu_form').validate({
		rules: {
		    degree: 'required',
		    majors: 'required',
		    school: 'required',
		    graduation: 'required',
		    courses: 'required'
		}
	    });
	}
    };
    octupus.init();
});

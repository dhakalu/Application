$(document).ready(function(){

    // ========= ACTIVATE ALL POP OVERS ====//
    
    $(function () {
	$('[data-toggle="popover"]').popover();
    });

    // ===
    $(function () {
	$('[data-toggle="tooltip"]').tooltip();
    });

    // ============FRAMES ============//
    var $workFrame = $('#work_frame');
    var $educationFrame = $('#education_frame');
    var $publicationFrame = $('#publication_frame');
    var $awardFrame = $('#award_frame');
    var $summaryFrame = $('#summaryFrame');
    var $skillFrame = $('#skill_frame');
    
    // =========== MODALS ===========//

    var $selfSummaryModal = $('#self_summary_modal');
    var $addEducationModal = $('#add_education_modal');
    var $addWorkModal = $('#add_work_modal');
    var $addTechnicalSkillModal = $('#add_technical_skill_modal');
    var $addAwardModal = $('#add_award_modal');
    var $addPublicationModal = $('#add_publication_modal');;
    
    $('#submit_add_edu_btn').click(function(){
	var formData = $('#add_education_form').serialize();
	octupus.submitEduAddForm(formData);
	console.log('subbmitted');
    });
    
    $('#submit_add_award_btn').click(function(){
	var formData = $('#add_award_form').serialize();
	octupus.submitAddAwardForm(formData);
    });

    $('#submit_add_work_btn').click(function(){
	var formData = $('#add_work_form').serialize();
	octupus.submitAddWorkForm(formData);
    });
    
    $('#submit_add_publication_btn').click(function(){
	var formData = $('#add_publication_form').serialize();
	octupus.submitAddPublicationForm(formData);
    });
    
    var model = {
	old_data : {
	    'award': 0,
	    'education': 0,
	    'publication': 0,
	    'work': 0,
	    'skill': 0
	},
	old_self_summary : '',
	get_json : function(){
	    var url = $(location).attr('pathname');
	    var u = url.split('/')[2];
	    $.ajax({
		url: '/resume_json?u=' + u,
		type: 'GET',
		dataType: 'json'
	    }).done(function(data){
		octupus.updatePage(data, model.old_data, model.old_self_summary);
	    });
	}
    };
    
    model.get_json();
    /* ==== EVENT LISTENERS */
    var view = {
	init :function(){
	    /* ========HIDE ALL FRAMES === */
	    $workFrame.hide();
	    $educationFrame.hide();
	    $awardFrame.hide();
	    $publicationFrame.hide();
	    $skillFrame.hide();

	    $('body').on('click', '.edit_edu_btn', function(){
		var eduId = $(this).attr('id').split('_')[1];
		octupus.editEducation(eduId);
	    });
	    
	    $('body').on('click', '.delete_edu_btn', function(){
		var eduId = $(this).attr('id').split('_')[1];
		octupus.deleteEducation(eduId);
	    });
	    
	    $('body').on('click', '.edit_award_btn', function(){
		var awardId = $(this).attr('id').split('_')[1];
		octupus.editAward(awardId);
	    });
	    
	    $('body').on('click', '.delete_award_btn', function(){
		var awardId = $(this).attr('id').split('_')[1];
		octupus.deleteAward(awardId);
	    });
	    
	    $('body').on('click', '.edit_work_btn', function(){
		var work_id = $(this).attr('id').split('_')[1];
		console.log(work_id);
		octupus.editWork(work_id);
	    });
	    
	    $('body').on('click', '.delete_work_btn', function(){
		var workId = $(this).attr('id').split('_')[1];
		octupus.deleteWork(workId);
	    });
	    
	    $('body').on('click', '.edit_publication_btn', function(){
		var publicationId = $(this).attr('id').split('_')[1];
		octupus.editPublication(publicationId);
	    });
	    
	    $('body').on('click', '.delete_publication_btn', function(){
		var publicationId = $(this).attr('id').split('_')[1];
		octupus.deletePublication(publicationId);
	    });

	    $('#self_add_form').submit(function(event){
		event.preventDefault();
		var formData = $('#self_add_form').serialize();
		octupus.submitSelfSummaryForm(formData);
	    });
	    
	}
    };
    
   
    var educationView = {
	init : function(education, old_data){
	     for (var i = old_data.education; i < education.length; i++){
		 this.edu = education[i];
		 this.render();
	     }
	    old_data.education = education.length;
	    octupus.updateOldData(old_data);
	},
	render: function(){
	    var this_institution = this.edu.institution;
	    var this_degree = this.edu.degree;
	    var this_courses = this.edu.courses;
	    var this_majors = this.edu.majors;
	    var this_gpa = this.edu.gpa;
	    var this_graduation = this.edu.graduation;
	    var edu_html_str = $educationFrame.html();
	    var $new_edu = $(edu_html_str);
	    $new_edu.find('.institution').html(this_institution);
	    $new_edu.find('.delete_edu_btn').attr('id', 'delete_'+ this.edu.id);
	    $new_edu.find('.edit_edu_btn').attr('id', 'edit_' + this.edu.id);
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
		coursesHtml +='<a class="option-box">' +  this_courses[j] + '</a>';
	    }
	    $new_edu.find('.courses').html($(coursesHtml));
	    $new_edu.attr('id', 'edu_' + this.edu.id);
	    $('#edu_details').prepend($new_edu);
	}
    };

    var awardView = {
	init : function(awards, old_data){
	    for (var i = old_data.award; i < awards.length; i++){
		this.award = awards[i];
		this.render();
	    }
	    old_data.award = awards.length;
	    octupus.updateOldData(old_data);
	},
	render: function(){
	    var award_html_str = $('#award_frame').html();
	    var $new_award = $(award_html_str);
	    $new_award.find('.title').text(this.award.title);
	    $new_award.find('.edit_award_btn').attr('id', 'edit_' + this.award.id);
	    $new_award.find('.delete_award_btn').attr('id', 'delete_' + this.award.id);
	    $new_award.find('.details').text(this.award.details);
	    $new_award.attr('id','award_' + this.award.id);
	    $('#award_details').prepend($new_award);
	}
	
    };
    
    var publicationView = {
	init : function( publications,old_data){
	    for (var i = old_data.publication; i<publications.length; i++){
		this.pub = publications[i];
		this.render();
	    }
	    old_data.publication = publications.length;
	    octupus.updateOldData(old_data);
	},
	render: function(){
	    var pub_html_str = $('#publication_frame').html();
	    var $new_pub = $(pub_html_str);
	    $new_pub.find('.link').attr('href', this.pub.link);
	    $new_pub.find('.title').text(this.pub.title);
	    $new_pub.find('.edit_publication_btn').attr('id', 'edit_' + this.pub.id);
	    $new_pub.find('.delete_publication_btn').attr('id','delete_' +  this.pub.id);
	    $new_pub.find('.authors').text(this.pub.authors);
	    $new_pub.attr('id', 'publication_'+ this.pub.id);
	    $('#publications_details').prepend($new_pub);
	} 
	
    };
    
    var workView = {
	init: function(works, old_data){
	    for (var i = old_data.work; i< works.length; i++){
		this.work = works[i];
		this.render();
	    } 
	    old_data.work = works.length;
	    octupus.updateOldData(old_data);
	},
	render: function(){
	    var work_html_str = $('#work_frame').html();
	    var $new_work = $(work_html_str);
	    $new_work.find('.title').text(this.work.title);
	    $new_work.find('.edit_work_btn').attr('id',  'edit_' + this.work.id);
	    $new_work.find('.delete_work_btn').attr('id', 'delete_' + this.work.id);
	    $new_work.find('.employer').text(this.work.employer);
	    $new_work.find('.duration').text(this.work.start_date + '-' + this.work.end_date);
	    $new_work.find('.details').text(this.work.details);
	    $new_work.attr('id', 'work_' + this.work.id);
	    $('#work_details').prepend($new_work);
	 
	}
    };
    
    var selfSummaryView = {
	init: function(self_summary, old_self_summary){
	    if (old_self_summary != self_summary.summary){
		this.render(self_summary);
	    }
	    octupus.updateOldSelfSummary(self_summary);
	},
	render: function(self_summary){
	    var $new_summary = $($('#summary_frame').html());
	    $new_summary.find('.summary').text(self_summary.summary);
	    $('#self_details').html($new_summary);
	}
    };

    var technicalSkillView = {
	init : function(skills, old_data){
	    for( var i = old_data.skill; i< skills.length; i++){
		this.skill = skills[i];
		this.render();
	    }
	    old_data.skill = skills.length;
	    octupus.updateOldData(old_data);
	},
	render: function(){
	    var new_skill_str = $('#skill_frame').html(); 
	    var $new_skill = $(new_skill_str);
	    console.log($new_skill.html());
	    $new_skill.find('.option-box').text(this.skill.title

);
	    $('#skills_details').append($new_skill);
	}
	
    };

    $('#edit_summary_btn').click(function(){
	addSelfSummaryFormView.render();
    });

    /* ======= FORM VIEWS ====*/
    var addSelfSummaryFormView = {
	init: function(){
	    $('#submit_self_summary_btn').click(function(){
		var formData = $('#self_add_form').serialize();
		octupus.submitSelfSummaryForm(formData);
	    });
	},
	render: function(){
	    $selfSummaryModal.modal('toggle');
	    var currSummary = $('#self_details').find('.summary').text();
	    if ( currSummary!= ''){
		$('#self_add_form').find('textarea').val(currSummary);
	    }
	}
    };
    
    var editEducationFormView = {
	init: function(){
	    this.$dialog = $('#edit_education_modal');
	    $('#submit_edit_edu_btn').click(function(){
		var formData = $('#edit_education_form').serialize();
		
		octupus.submitEditEducationForm(formData, editEducationFormView.eduId);
	    });
	},
	open: function() {
	    this.$dialog.modal('toggle');
	},
	close: function(){
	    this.$dialog.modal('hide');
	},
	renderEditForm: function($eduDom, eduId){
	    this.eduId = eduId;
	    editEducationFormView.open();
	    var institution = $eduDom.find('.institution').text();
	    var degree = $eduDom.find('.degree').text();
	    var majors = $eduDom.find('.majors').text();
	    var graduation = $eduDom.find('.graduation').text();
	    var gpa = $eduDom.find('.gpa').text();
	    var $coursesDom = $eduDom.find('.courses').find('button');
	    var courses = '';
	    for( var i=0; i< $coursesDom.length; i++){
		var $thisBttn = $($coursesDom[i]);
		courses += $thisBttn.text().trim();
		courses += ', ';
	    }
	    this.$dialog.find('#degree').val(degree);
	    this.$dialog.find('#majors').val(majors);
	    this.$dialog.find('#school').val(institution);
	    this.$dialog.find('#gpa').val(gpa);
	    this.$dialog.find('#graduation').val(graduation);
	    this.$dialog.find('#courses').val(courses);
	}
    };

    var editWorkFormView = {
	init: function(){
	    this.$dialog = $('#edit_work_modal');
	    $('#submit_edit_work_btn').click(function(){
		var formData = $('#edit_work_form').serialize();
		octupus.submitEditWorkForm(formData, editWorkFormView.workId);
	    });
	},
	open: function(){
	    this.$dialog.modal('toggle');
	},
	close: function(){
	    this.$dialog.modal('hide');
	},
	renderEditForm: function($workDom, workId){
	    this.workId = workId;
	    editWorkFormView.open();
	    var title = $workDom.find('.title').text();
	    var employer = $workDom.find('.employer').text();
	    var dates = $workDom.find('.duration').text().split('-');
	    var start_date = dates[0];
	    var end_date = dates[1];
	    var details = $workDom.find('.details').text();
	    this.$dialog.find('#work_title').val(title);
	    this.$dialog.find('#employer').val(employer);
	    this.$dialog.find('#start_date').val(start_date);
	    this.$dialog.find('#end_date').val(end_date);
	    this.$dialog.find('#work_details').val(details);
	}
    };
    
    var editAwardFormView = {
	init: function(){
	    this.$dialog = $('#edit_award_modal');
	     $('#submit_edit_award_btn').click(function(){
		var formData = $('#edit_award_form').serialize();
		octupus.submitEditAwardForm(formData, editAwardFormView.awardId);
	    });
	},
	open: function(){
	    this.$dialog.modal('toggle');
	},
	close: function(){
	    this.$dialog.modal('hide');
	},
	renderEditForm: function($awardDom, awardId){
	    this.awardId = awardId;
	    this.open();
	    var title = $awardDom.find('.title').text();
	    var details = $awardDom.find('.details').text();
	    this.$dialog.find('#award_title').val(title);
	    this.$dialog.find('#about_award').val(title);
	},
	getAwardId: function(){
	    return this.awardId;
	}
    };
    
    var editPublicationFormView = {
	init: function(){
	    this.$dialog =  $('#edit_publication_modal');
	     $('#submit_edit_publication_btn').click(function(){
		var formData = $('#edit_publication_form').serialize();
		octupus.submitEditPublicationForm(formData, editPublicationFormView.publicationId);
	    });
	},
	close: function(){
	    this.$dialog.modal('hide');
	},
	open: function(){
	    this.$dialog.modal({
		backdrop: 'static',
		keyboard: false
	    });
	},
	renderEditForm: function($publicationDom, publicationId){
	    this.open();
	    this.publicationId = publicationId;
	    var title = $publicationDom.find('.title').text();
	    var authors = $publicationDom.find('.authors').text();
	    var link = $publicationDom.find('.link').attr('href');
	    this.$dialog.find('#title').val(title);
	    this.$dialog.find('#link').val(link);
	    this.$dialog.find('#authors').val(authors);
	},
	getPublicationId: function(){
	    return this.publicationId;
	}
    };
    
   
    /* =====Accordion View ======= */
    var resumeAccordionView = {
	init : function(){
	     $('#resume_accordion').accordion({
		 heightStyle: "content"
	     });
	}
    };
    
     $('#accordion').collapse();
   
    // Date picker
    $('.datepicker').datepicker();
    // end of ready function
    
    
    // ============ALET BOXES =============//

    var deleteEducationAlertView = {
	init: function(passed_function){
	    this.$dialog =  $('#delete_alert_box');
	    this.$dialog.dialog({
		title: 'Plese verify your action',
		medal: true,
		draggable: false,
		resizeable: false,
		autoOpen: false,
		dialogClass: 'no-close success-dialog',
		buttons: [
		    {
			text: "Delete",
			icons: {
			    primary: "ui-icon-close"
			},
			click: function(){
			    octupus.sendDeleteEduRequest(deleteEducationAlertView.eduId);
			}
		    },
		    {
			text: "Cancel",
			icons: {
			    primary: "ui-icon-close"
			},
			click: function(){
			    deleteEducationAlertView.close();
			}
		    }
		]
	    });
	},
	close: function(){
	    this.$dialog.dialog('close');
	},
	open: function(eduId){
	    this.eduId = eduId;
	    this.$dialog.dialog('open');
	}
    };
    
    var deleteWorkAlertView = {
	init: function(){
	    this.$dialog =  $('#delete_work_alert_box');
	    this.$dialog.dialog({
		medal: true,
		draggable: false,
		resizeable: false,
		autoOpen: false,
		dialogClass: 'no-close success-dialog',
		buttons: [
		    {
			text: "Delete",
			icons: {
			    primary: "ui-icon-close"
			},
			click: function(){
			    octupus.sendDeleteWorkRequest(deleteWorkAlertView.workId);
			}
		    },
		    {
			text: "Cancel",
			icons: {
			    primary: "ui-icon-close"
			},
			click: function(){
			    deleteWorkAlertView.close();
			}
		    }
		]
	    });
	},
	close: function(){
	    this.$dialog.dialog('close');
	},
	open: function(workId){
	    this.workId = workId;
	    this.$dialog.dialog('open');
	}
    }; 
    
    var deleteAwardAlertView = {
	init: function(passed_function){
	    this.$dialog =  $('#delete_award_alert_box');
	    this.$dialog.dialog({
		medal: true,
		draggable: false,
		resizeable: false,
		autoOpen: false,
		dialogClass: 'no-close success-dialog',
		buttons: [
		    {
			text: "Delete",
			icons: {
			    primary: "ui-icon-close"
			},
			click: function(){
			    octupus.sendDeleteAwardRequest(deleteAwardAlertView.awardId);
			}
		    },
		    {
			text: "Cancel",
			icons: {
			    primary: "ui-icon-close"
			},
			click: function(){
			    deleteAwardAlertView.close();
			}
		    }
		]
	    });
	},
	close: function(){
	    this.$dialog.dialog('close');
	},
	open: function(awardId){
	    this.awardId = awardId;
	    this.$dialog.dialog('open');
	}
    };

    var deletePublicationAlertView = {
	init: function(){
	    this.$dialog =  $('#delete_publication_alert_box');
	    this.$dialog.dialog({
		medal: true,
		draggable: false,
		resizeable: false,
		autoOpen: false,
		dialogClass: 'no-close success-dialog',
		buttons: [
		    {
			text: "Delete",
			icons: {
			    primary: "ui-icon-close"
			},
			click: function(){
			    console.log(deletePublicationAlertView.publicationId);
			    octupus.sendDeletePublicationRequest(deletePublicationAlertView.publicationId);
			}
		    },
		    {
			text: "Cancel",
			icons: {
			    primary: "ui-icon-close"
			},
			click: function(){
			    deletePublicationAlertView.close();
			}
		    }
		]
	    });
	},
	close: function(){
	    this.$dialog.dialog('close');
	},
	open: function(publicationId){
	    this.publicationId = publicationId;
	    this.$dialog.dialog('open');
	}
    };

    var octupus = {
	init: function(){
	    view.init();
	    resumeAccordionView.init();
	    addSelfSummaryFormView.init();
	    editAwardFormView.init();
	    editEducationFormView.init();
	    editWorkFormView.init();
	    editPublicationFormView.init();
	    deleteEducationAlertView.init();
	    deletePublicationAlertView.init();
	    deleteAwardAlertView.init();
	    deleteWorkAlertView.init();
	},

	submitAddTechnicalSkillForm: function(formData){
	    $.ajax({
		url: '/updatetechnicalskill',
		type: 'POST',
		data: formData,
		dataType: 'json'
	    }).done(function(data){
		console.log(data);
		   $addTechnicalSkillModal.modal('hide');
		});
	},
	
	submitSelfSummaryForm: function(formData){
	    $.ajax({
		url: '/updateselfsummary',
		type: 'POST',
		data: formData,
		dataType: 'json'
	    })
		.done(function(data){
		    $('#self_add_form')[0].reset();
		    $selfSummaryModal.modal('hide');
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
		    $addEducationModal.modal('hide');
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
		$addWorkModal.modal('hide');
	    });
	},

	submitAddAwardForm: function(formData){
	    $.ajax({
		url: '/updateaward',
		type: 'POST',
		data: formData,
		dataType: 'json'
	    }).done(function(data){
		$('#add_award_form')[0].reset();
		$addAwardModal.modal('hide');
	    });
	},

	submitAddPublicationForm: function(formData){
	    $.ajax({
		url: "/updatepublication",
		type: 'POST',
		data: formData,
		dataType: 'json'
	    }).done(function(data){
		$('#add_publication_form')[0].reset();
		$addPublicationModal.modal('hide');
	    });
	},

	updatePage: function(data, old_data, old_self_summary){
	    var results = data.results;
	    var awards = results.awards;
	    var education = results.education;
	    var works = results.works;
	    var publications = results.publications;
	    var self_summary = results.summary;
	    var skills =  results.skills;
	    selfSummaryView.init(self_summary, old_self_summary);
	    educationView.init(education, old_data);
	    workView.init(works, old_data);
	    awardView.init(awards, old_data);
	    publicationView.init(publications, old_data);
	    technicalSkillView.init(skills, old_data);
	},
	resetEducationDiv: function(){
	    var old_data = model.old_data;
	    old_data.education = 0;
	    this.updateOldData(old_data);
	    $('#edu_details').html('');
	},

	updateOldData: function(newData){
	    model.old_data = newData;
	},

	updateOldSelfSummary: function(summary){
	    model.old_self_summary = summary;
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
	},

	editEducation: function(eduId){
	    var $eduDom = $('#edu_' + eduId);
	    editEducationFormView.renderEditForm($eduDom, eduId);
	},

	editWork: function(workId){
	    var $workDom = $('#work_' + workId);
	    editWorkFormView.renderEditForm($workDom, workId);
	},

	editAward: function(awardId){
	    var $awardDom = $('#award_' + awardId);
	    editAwardFormView.renderEditForm($awardDom, awardId);
	},

	editPublication: function(publicationId){
	    var $publicationDom = $('#publication_' + publicationId);
	    editPublicationFormView.renderEditForm($publicationDom, publicationId);
	},
	
	submitEditAwardForm: function(formData, awardId){
	    $.ajax({
		url: '/editaward?id=' + awardId,
		data: formData,
		type: 'POST',
		dataType: 'json'
	    }).done(function(data){
		if (data.status == 'OK'){
		    editAwardFormView.close();
		}
	    });
	},
	submitEditEducationForm: function(formData, eduId){
	   $.ajax({
	       url: '/editeducation?id=' + eduId,
	       type: 'POST',
	       data: formData,
	       dataType: 'json'
	   }).done(function(data){
	      if (data.status == 'OK'){
		  editEducationFormView.close();
		  octupus.resetEducationDiv();
	      }
	   }); 
	},
	submitEditWorkForm: function(formData, workId){
	    $.ajax({
		url: '/editwork?id=' + workId,
		type: 'POST',
		dataType:'json',
		data: formData
	    }).done(function(data){
		if (data.status == 'OK'){
		    editWorkFormView.close();
		}
	    });
	},
	submitEditPublicationForm: function(formData, publicationId){
	    $.ajax({
		url: '/editpublication?id=' + publicationId,
		type: 'POST',
		dataType: 'json',
		data: formData
	    })
	    .done(function(data){
		if(data.status == 'OK'){
		    editPublicationFormView.close();
		}
	    });
	},

	deleteEducation: function(eduId){
	    deleteEducationAlertView.open(eduId);
	},

	deleteWork: function(workId){
	    deleteWorkAlertView.open(workId);
	},

	deletePublication: function(publicationId){
	    deletePublicationAlertView.open(publicationId);
	},
	
	deleteAward: function(awardId){
	    deleteAwardAlertView.open(awardId);
	},

	sendDeleteEduRequest: function(eduId){
	    $.ajax({
		url: '/deleteeducation?id=' + eduId,
		type: 'POST',
		dataType: 'json'
	    }).done(function(data){
		deleteEducationAlertView.close();
		if(data.status == 'ERR'){
		    alert(data.error);
		}else{
		    octupus.resetEducationDiv();
		}
	    });
	},
	
	sendDeleteWorkRequest: function(workId){
	    $.ajax({
		url: '/deletework?id=' + workId,
		type: 'POST',
		dataType: 'json'
	    }).done(function(data){
		deleteWorkAlertView.close();
		if(data.status == 'ERR'){
		    alert(data.error);
		}
	    });
	},

	sendDeleteAwardRequest: function(awardId){
	    $.ajax({
		url: '/deleteaward?id=' + awardId,
		type: 'POST',
		dataType: 'json'
	    }).done(function(data){
		deleteAwardAlertView.close();
		if(data.status == 'ERR'){
		    alert(data.error);
		}
	    });

	},

	sendDeletePublicationRequest: function(publicationId){
	    $.ajax({
		url: '/deletepublication?id=' + publicationId,
		type: 'POST',
		dataType: 'json'
	    }).done(function(data){
		deletePublicationAlertView.close();
		if(data.status == 'ERR'){
		    alert(data.error);
		}
	    });

	}
    };
    setInterval(model.get_json, 3000);
    octupus.init();
});

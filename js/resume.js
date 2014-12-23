$(document).ready(function(){
    
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

$(document).ready(function(){
     loadPage();
     function loadPage(){
	var old_data = [0, 0];
	mark_done = function(){
	    console.log('Clicked');
	};
        setInterval(function() {
	    $.ajax({
		url: '/todo_json',
		dataType: 'json'
	    }).done(function(data){
		if (data.status == 'OK'){
		    var done_task = data.done_tasks;
		    var todo_task = data.todo_tasks;
		    for ( var i = old_data[0]; i< done_task.length; i++){
			$('#completed-list').prepend(done_task[i].task + "<hr>").slideDown();
		    }
		    for ( var i = old_data[1]; i< todo_task.length; i++){
			var updateHtml = '<div class="box-flat task-box row">';
			updateHtml += '<div class="col-md-1 mark_done"></div>';
			updateHtml += '<div class="col-md-8 title"></div>';
			updateHtml += '<div class="col-md-1 edit"></div>';
			updateHtml += '<div class="col-md-1 remove"></div>';
			updateHtml += '</div>';
			var $updateHtml = $(updateHtml);
			$updateHtml.find('.title').text(todo_task[i].task);
			var $done_btn = $('<button class="mark_done_btn"></button>').button({
			    icons: {
				primary: "ui-icon-check"
			    }
			});
			$updateHtml.find('.mark_done').html($done_btn);
			var $edit_btn = $('<button class="edit_btn"></button>').button({
			    icons : {
				primary: "ui-icon-pencil"
			    }
			});
			$updateHtml.find('.edit').html($edit_btn);
			var $delete_btn = $('<button class="remove_btn"></button>').button({
			    icons :{
				primary: "ui-icon-minus"
			    }
			});
			$updateHtml.find('.remove').html($delete_btn);
			$updateHtml.find('.mark_done_btn').attr('id','mark_done_' + todo_task[i].id);
			$updateHtml.find('.edit_btn').attr('id','edit_' + todo_task[i].id);
			$updateHtml.find('.remove_btn').attr('id', 'remove_' + todo_task[i].id);
			$updateHtml.hide();
			$('#todo-list').prepend($updateHtml);
			$updateHtml.show('clip',250).effect('highlight',1000);
		    }
		    old_data[0] = done_task.length;
		    old_data[1] = todo_task.length;
		}
	    });
	}, 3000);
     };
    
     // Function that marks the job as done
    $('body').on('click', '.mark_done_btn', function(){
	var id = $(this).attr('id').split('_')[2];
	var formData = 'mark_done=' + id;
	$.ajax({
		    url: '/updatetodo',
		    type: 'POST',
		    data: formData,
		    dataType: 'json'
		}).done(function(data){
		    $('#todo-form')[0].reset();
		    $('#add-new-todo').dialog('close');
		});
    });// end of making done

    $('#add-to-list').button({
	icons: {
	    primary: "ui-icon-circle-plus"
	}
    }).click(function(){
	$('#add-new-todo').dialog('open');
    }); // end of button
    
    $('[title]').tooltip({
	tooltipClass : 'tooltip'
    }); // end of tooltip


    $('#add-new-todo').dialog({
	draggable : false,
	resizeable : false,
	modal : true,
	autoOpen : false,
	dialogClass: 'no-close form-dialog',
	buttons : [{
	    text: 'Add',
	    icons: {
		primary : "ui-icon-plus"
	    },
	    click: function(){
		var formData = $('#todo-form').serialize();
		$.ajax({
		    url: '/updatetodo',
		    type: 'POST',
		    data: formData,
		    dataType: 'json'
		}).done(function(data){
		    $('#todo-form')[0].reset();
		    $('#add-new-todo').dialog('close');
		});
	    } // end of clisk
	}, // end of add bttn
	{
	    text: "Cancel",
	    icons: {
		primary: "ui-icon-close"
	    },
	    click: function(){
		$('#add-new-todo').dialog('close');
	    } //  end of click
	}// end of cancel bttn
		   
	]
    }); // end of dialog
    
    $('#todo-list').on('click', '.done', function(){
	var $doneTask = $(this).parent('div').parent('div');
	$doneTask.slideUp(250, function() {
	    var $this = $(this);
	    $this.detach();
	    $('#completed-list').prepend($this);
	    $this.slideDown();
	});
    });
    
}); // end of ready 

$(document).ready(function(){
     loadPage();
    
     function loadPage(){
	var old_data = [0, 0];
        setInterval(function() {
	    $.ajax({
		url: '/todo_json',
		dataType: 'json'
	    }).done(function(data){
		if (data.status == 'OK'){
		    console.log(data);
		    var done_task = data.done_tasks;
		    var todo_task = data.todo_tasks;
		    for ( var i=old_data[0]; i< done_task.length; i++){
			$('#completed-list').prepend(done_task[i].task + "<hr>").slideDown();
		    }
		    for ( var i=old_data[1]; i< todo_task.length; i++){
			var updateHtml = '<div class="box-flat row">';
			updateHtml += '<div class="col-md-1"> </div>';
			updateHtml += '<div class="col-md-10"></div>';
			updateHtml += '<div class="col-md-1"></div>';
			updateHtml += '</div>';
			var $updateHtml = $(updateHtml);
			$updateHtml.find('.col-md-6').text(todo_task[i].task);
			$updateHtml.hide();
			$('#todo-list').prepend($updateHtml);
			$updateHtml.show('clip',250).effect('highlight',1000);
		    }
		    old_data[0] = done_task.length-1;
		    old_data[1] = todo_task.length-1;
		}
	    });
	}, 3000);
     };

    
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
		    console.log(data);
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

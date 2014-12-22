$(document).ready(function(){
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
	buttons : {
	    'Add task' : function(){
		var taskName = $('#new-todo').val();
		if (taskName === ''){
		    return false;
		}
		var taskHTML = '<div class="task-box row">'  ;
		taskHTML +='<div class="col-md-1"><span class="done"><a href="" title="Mark as done">Done</a></span></div>';
                taskHTML += '<div class="task col-md-10"></div>';
		taskHTML += '<div class="col-md-1"><span class="delete"><a href="" title="Remove Task">X</a></span></div></div>';
		console.log(taskHTML);
		var $newTask = $(taskHTML);
		$newTask.find('.task').text(taskName);
		$newTask.hide();
		$('#todo-list').prepend($newTask);
		$newTask.show('clip',250).effect('highlight',1000                );
		$(this).dialog('close');
	    },
	    'Cancel' : function(){
		$(this).dialog('close');
	    }
	},
	close: function() {
	    $('#todo-form input').val('');
	}
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

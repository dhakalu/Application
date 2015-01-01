$(document).ready(function(){
    var model = {
	init: function(){
	    this.old_data = [0,0];
	    this.todo_list = {};
	    this.done_list = {};
	},
	getJson : function(){
	    $.ajax({
		url: '/todo_json',
		dataType: 'json'
	    }).done(function(data){
		octupus.updatePage(data.todo_tasks, data.done_tasks);
	    });
	}
    };
    
    var todoListView = {
	init : function(todo_list){
	     $('#todo-list').html('');
	    for ( var i = 0; i < todo_list.length; i++){
		this.task = todo_list[i];
		this.render();
	    }
	},
	render: function(){
	    var updateHtml = '<div class="box-flat task-box row">';
	    updateHtml += '<div class="col-md-9 title col-sm-9"></div>';
	    updateHtml += '<div class="btn-group options col-md-3 col-sm-3" role="group"></div>';
	    updateHtml += '</div>';
	    var $updateHtml = $(updateHtml);
	    $updateHtml.find('.title').text(this.task.task);
	    var $done_btn = $('<button class="mark_done_btn btn btn-default" type="button"><span class="glyphicon glyphicon-ok"></span></button>');
	    $updateHtml.find('.options').append($done_btn);
	    var $edit_btn = $('<button class="edit_btn btn btn-default"><span class="glyphicon glyphicon-pencil"></span></button>');
	    $updateHtml.find('.options').append($edit_btn);
	    var $delete_btn = $('<button class="remove_btn btn btn-default"><span class="glyphicon glyphicon-remove"></span></button>');
	    $updateHtml.find('.options').append($delete_btn);
	    $updateHtml.find('.mark_done_btn').attr('id','mark_done_' + this.task.id);
	    $updateHtml.find('.edit_btn').attr('id','edit_task_' + this.task.id);
	    $updateHtml.find('.remove_btn').attr('id', 'remove_task_' + this.task.id);
	    // $updateHtml.hide();
	    $('#todo-list').prepend($updateHtml);
	    //$updateHtml.show('clip',250).effect('highlight',1000);
	}
    };
   
    
    
    var doneListView = {
	init: function(done_list){
	    $('#completed-list').html('');
	    for (var i = 0 ; i< done_list.length; i++){
		this.task = done_list[i];
		this.render();
	    }
	},
	render: function(){
	    var completedTaskHtml = $('#completed_task_frame').html();
	    var $doneTask = $(completedTaskHtml);
	    $doneTask.find('.title').text(this.task.task);
	    $doneTask.find('.unmark_done_btn').attr('id', 'unmark_done_' + this.task.id);
	    $doneTask.find('.remove_btn').attr('id', 'remove_task_' + this.task.id);
	    $('#completed-list').append($doneTask);
	}
    };

    var addToListButtonView = { 
	init: function(){
	    $('#add-to-list').button({
		icons: {
		    primary: "ui-icon-circle-plus"
		}
	    }).click(function(){
		$('#add-new-todo').dialog('open');
	    }); // end of button
	}
    };	
    
    var toolTipView = {
	init: function(){
	    $('[title]').tooltip({
		tooltipClass : 'tooltip'
	    });
	}
    };

    var addTaskFormView = {
	init: function(){
	    this.$dialog = $('#add-new-todo');
	    this.$dialog.dialog({
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
			console.log(formData);
			octupus.sendAddTaskRequest(formData);
		    }
		},
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
	},
	close: function(){
	    this.$dialog.dialog('close');
	}
    };
    
    var eventListeners = {
	init: function(){	    
	    $('body').on('click', '.mark_done_btn', function(){
		var id = $(this).attr('id').split('_')[2];
		console.log(id);
		var formData = 'mark_done=' + id;
		octupus.sendUpdateTaskRequest(formData);
	    });

	    $('body').on('click','.edit_btn', function(){
		var id=$(this).attr('id').split('_')[2];
		console.log(id);
		var formData = 'edit=' + id;
		octupus.editTask();
	    });
	    
	    $('body').on('click', '.remove_btn', function(){
		console.log($(this).attr('id'));
		var id=$(this).attr('id').split('_')[2];
		var formData = 'delete=' + id;
		console.log(formData);
		octupus.sendUpdateTaskRequest(formData);
	    });
	}
    };
    
    var octupus = {
	init: function(){
	    addToListButtonView.init();
	    addTaskFormView.init();
	    toolTipView.init();
	    model.init();
	    model.getJson();
	    eventListeners.init();
	},
	sendAddTaskRequest : function(formData){
	    $.ajax({
		url: '/updatetodo',
		type: 'POST',
		data: formData,
		dataType: 'json'
	    }).done(function(data){
		model.getJson();
		$('#todo-form')[0].reset();
		addTaskFormView.close();
	    });
	},
	sendUpdateTaskRequest: function(formData){
	    $.ajax({
		url: '/updatetodo',
		type: 'POST',
		data: formData,
		dataType: 'json'
	    }).done(function(data){
		model.getJson();
	    });
	},
	updatePage: function(todo_list, done_list){
	    todoListView.init(todo_list);
	    doneListView.init(done_list);
	},
	updateOldData: function(new_data){
	    model.old_data = new_data;
	}
    };
    octupus.init();
    setInterval(model.getJson, 3000);
    
}); // end of ready 

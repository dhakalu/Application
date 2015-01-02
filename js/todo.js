$(document).ready(function(){
    var addNewTaskModal = $('#add_new_task_modal');
    var editTaskModal = $('#edit_task_modal');
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
	    var updateHtml = $('#todo_task_frame').html();
	    var $updateHtml = $(updateHtml);
	    $updateHtml.find('.title').text(this.task.task);
	    $updateHtml.find('.mark_done_btn').attr('id','mark_done_' + this.task.id);
	    $updateHtml.find('.edit_btn').attr('id','edit_task_' + this.task.id);
	    $updateHtml.find('.remove_btn').attr('id', 'remove_task_' + this.task.id);
	    $updateHtml.find('.task-box').attr('id', 'task_' + this.task.id);
	    $('#todo-list').prepend($updateHtml);
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

    
    var toolTipView = {
	init: function(){
	    $('[title]').tooltip();
	}
    };
    
    
    var editFormView = {
	init: function(){
	    this.$dialog = $('#edit_task_modal');
	    $('#submit_edit_task_btn').click(function(){
		var formData = $('#edit_todo_form').serialize();
		octupus.submitEditTaskRequest(editFormView.taskId, formData);
	    });
	},
	render: function(taskId){
	    this.taskId = taskId;
	    this.$dialog.modal('toggle');
	    console.log($('#task_' + taskId));
	    var title = $('#task_' + taskId).find('.title').text();
	    console.log(title);
	    this.$dialog.find('#edit_todo_input').val(title);
	}
    };

    editFormView.init();
    
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
		octupus.editTask(id);
	    });
	    
	    $('body').on('click', '.remove_btn', function(){
		console.log($(this).attr('id'));
		var id=$(this).attr('id').split('_')[2];
		var formData = 'delete=' + id;
		console.log(formData);
		octupus.sendUpdateTaskRequest(formData);
	    });
	    
	    $('#submit_add_task_btn').click(function(){
		var formData = $('#todo-form').serialize();
		octupus.sendAddTaskRequest(formData);
	    });
	}
    };
    
   
    addNewTaskModal.on('shown.bs.modal', function() {
	$('#add_todo_input').focus();
    });
    
    editTaskModal.on('shown.bs.modal', function(){
	$('#edit_todo_input').focus();
    });

    var octupus = {
	init: function(){
	    toolTipView.init();
	    model.init();
	    model.getJson();
	    eventListeners.init();
	},
	editTask: function(taskId){
	    editFormView.render(taskId);
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
		$('#add_new_task_modal').modal('hide');
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
	submitEditTaskRequest: function(taskId, formData){
	    $.ajax({
		url: '/updatetodo',
		type: 'POST',
		data: 'edit=' + taskId + '&' + formData,
		dataType: 'json'
	    }).done(function(data){
		model.getJson();
		$('#edit_todo_form')[0].reset();
		$('#edit_task_modal').modal('hide');
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

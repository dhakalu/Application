$(document).ready(function(){
    
    var $addTaskBtn = $('#add_task_btn');		// btn clicked to add the task
    var $createShoppingBtn = $('#create_shopping_btn'); // tbn that creates the shopping list
    var $addTaskModal = $('#add_task_modal');
    var $addTaskForm = $('#add_task_form');
    var $createShoppingModal = $('#add_shopping_modal');

    // takes the data about the task from the backend
    var taskData = {
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
			taskMethods.updatePage(data.todo_tasks, data.done_tasks);
	    	});
		}
     };
   
   // reload the page in each 3 seconds to keep up to date with the 
   // backend
    setInterval(taskData.getJson, 3000);

    // this is the button that starts the add task modal
    var addTaskBtnView= {
	init: function(){
	    this.listenClick();
	},
	listenClick: function(){
	    $addTaskBtn.click(function(){
			console.log('clicked');
			addTaskModalView.open();
	    });
	}
    };
    
    var addTaskModalView = {
	// Initializes the validations
	init: function(){
	    // When the modal opens up
	    $addTaskModal.on('shown.bs.modal', function () {
		$addTaskForm.find('input').focus();
		$addTaskForm.validate({
		    rules: {
				task: 'required'
		    },
		    messages: {
				task: {
			    	required: "The name of task cannot be empty!"
				}
		    },
		    	submitHandler: function(){
				var formData = $addTaskForm.serialize();
				taskMethods.sendAddTaskRequest(formData);
		    }
			});
	    });

	    // The function that gets triggred when the modal hides
	    $('#myModal').on('hidden.bs.modal', function (e) {
		$addTaskForm[0].reset();
	    });
	},
	open: function(){
	    $addTaskModal.modal('toggle');
	},
	close: function(){
	    $addTaskModal.modal('hide');
	}, 
	submit: function(){
	}
    };
    
    // the list where the lists of tasks obtained form the backend is shown
    var todoListView = {
	init : function(todo_list){
	    var $toDoContainer = $('#todo_list_container');
	    $toDoContainer.html('');
	    if (todo_list.length > 0){ // ig there are tasks show the tasks in the list
			var $header = $('<div class="header list-title text-center">Task to be done</div>');
			$toDoContainer.append($header);
			for ( var i = 0; i < todo_list.length; i++){
		    	this.task = todo_list[i];
		    	this.render();
			}
	    }else{
	    	//if no tasks are added by that user, show this message
			var $noMessage = $('<div class="default-message-box">Fun times!
					 It seems you do not have any tasks to be done. </div>');
			$toDoContainer.append($noMessage);
	    }
	},
	render: function(){ 
	    var updateHtml = $('#todo_task_frame').html();
	    var $updateHtml = $(updateHtml);
	    $updateHtml.find('.title').text(this.task.task);
	    $updateHtml.find('.mark_done_btn').attr('id','mark_done_' + this.task.id);
	    $updateHtml.find('.edit_task_btn').attr('id','edit_task_' + this.task.id);
	    $updateHtml.find('.remove_task_btn').attr('id', 'remove_task_' + this.task.id);
	    $updateHtml.find('.task-box').attr('id', 'task_' + this.task.id);
	    $('#todo_list_container').append($updateHtml);
	}
    };
    
    
    
    var doneListView = {
	init: function(done_list){
	    $('#completed-list').html('');
	    if (done_list.length >0 ){
		var $header = $('<div class="header list-title text-center">Completed Task</div>');
		$('#completed-list').append($header);
		for (var i = 0 ; i< done_list.length; i++){
		    this.task = done_list[i];
		    this.render();
		}
	    }
	},
	render: function(){
	    var completedTaskHtml = $('#completed_task_frame').html();
	    var $doneTask = $(completedTaskHtml);
	    $doneTask.find('.title').text(this.task.task);
	    $doneTask.find('.unmark_done_btn').attr('id', 'unmark_done_' + this.task.id);
	    $doneTask.find('.remove_task_btn').attr('id', 'remove_task_' + this.task.id);
	    $('#completed-list').append($doneTask);
	}
    };


     var eventListeners = {
	init: function(){	    
	    $('body').on('click', '.mark_done_btn', function(){
		var id = $(this).attr('id').split('_')[2];
		console.log(id);
		var formData = 'mark_done=' + id;
		taskMethods.sendUpdateTaskRequest(formData);
	    });

	    $('body').on('click','.edit_task_btn', function(){
		var id=$(this).attr('id').split('_')[2];
		console.log(id);
		taskMethods.editTask(id);
	    });
	    
	    $('body').on('click', '.remove_task_btn', function(){
		console.log($(this).attr('id'));
		var id=$(this).attr('id').split('_')[2];
		var formData = 'delete=' + id;
		console.log(formData);
		taskMethods.sendUpdateTaskRequest(formData);
	    });
	}
    };

    var taskMethods = {
	sendAddTaskRequest : function(formData){
	    $.ajax({
		url: '/updatetodo',
		type: 'POST',
		data: formData,
		dataType: 'json'
	    }).done(function(data){
		addTaskModalView.close();
	    });
	},
	sendUpdateTaskRequest: function(formData){
	    $.ajax({
		url: '/updatetodo',
		type: 'POST',
		data: formData,
		dataType: 'json'
	    }).done(function(data){
	//	model.getJson();
	    });
	},
	submitEditTaskRequest: function(taskId, formData){
	    $.ajax({
		url: '/updatetodo',
		type: 'POST',
		data: 'edit=' + taskId + '&' + formData,
		dataType: 'json'
	    }).done(function(data){
		//model.getJson();
		
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
    
    // ====================Shopping list ==================/
    var $addItemsForm = $('#add_shopping_form');
    var createShoppingBtnView = {
	init: function(){
	    this.listenClick();
	},
	listenClick: function(){
	    $createShoppingBtn.click(function(){
		console.log('Clicked');
		createShoppingModalView.open();
	    });
	}
    };
   
    var createShoppingList = function(formData){
	console.log("Called");
	$.ajax({
	    url: '/createshoppinglist',
	    data: formData,
	    dataType: 'json',
	    type: 'POST'
	}).done(function(data){
	    if(data.status == 'OK'){
		createShoppingModalView.close();
	    }
	});
    };

    var createShoppingModalView = {
	init: function(){
	    $createShoppingModal.on('shown.bs.modal', function(e){
		
	    });
	    $createShoppingModal.on('hidden.bs.modal', function(e){
	    
	    });
	    
	    $('#add_items_btn').click(function(){
		var $input = $('<input type="text" class="form-control default-input">');
		$addItemsForm.append($input);
	    });

	    $addItemsForm.on('submit', function(e){
		e.preventDefault();
		var items = $('#add_shopping_form :input');
		var name = $('#shopping_list_name').val();
		var formData = 'name=' + name +'&items=';
		for (var i=1; i<items.length; i++){
		   formData += $(items[i]).val() + "," ;
		}
		console.log(formData);
		createShoppingList(formData);
	    });
	    
	},
	open: function(){
	    $createShoppingModal.modal('toggle');
	}, 
	close: function(){
	    $createShoppingModal.modal('hide');
	}
    };
   
    var loadShoppingView = {
	init: function(shopping_list){
	    $('#shopping_lists').html('');
	    for(var i=0; i<shopping_list.length; i++){
		this.render(shopping_list[i]);
	    }
	},
	render: function(list){
	    var $listTitle = $('<div class="title-flat row list-title">' + list.name  + '</div> hr');
	    $('#shopping_lists').append($listTitle);
	    for(var i=0; i<list.items.length; i++){
		var tasks_str = $('#shopping_item_frame').html();
		var $taskFrame = $(tasks_str);
		var thisItem = list.items[i];
		$taskFrame.find('.name').text(thisItem[1]);
		$('#shopping_lists').append($taskFrame);
	    }
	}
    };

    var getLists =  function(){
	$.ajax({
	    url: '/lists_get_json',
	    dataType: 'json'
	}).done(function(data){
	    console.log(data);
	    console.log(data);
	    if (data.status == 'OK'){
		loadShoppingView.init(data.results.shopping_list);
		console.log(data.results.courses_list);
		loadCourseView.init(data.results.courses_list);
	    }else{
		alert(data.error);
	    }
	});
    };
    getLists();
   // setInterval(getLists, 3000);
    // ================= COURSES =================//
    var $createCoursesModal = $('#create_course_modal');
    var $createCourseBtn = $('#create_course_btn');
    var $addCourseForm = $('#add_course_form');
    var $addCourseBtn = $('#add_course_button');
    var createCourseBtnView =  {
	init: function(){
	    this.listenClick();
	},
	listenClick: function(){
	    $createCourseBtn.click(function(){
		createCourseModalView.open();
	    });
	}
    };

    var loadCourseView = {
	init: function(course_list){
	    $('#courses_lists .remaining-list').html('');
	    $('#courses_lists .completed-list').html('');
	    if(course_list.length > 0){
		for( var i=0; i<course_list.length; i++){
		    this.render(course_list[i]);
		}
	    }
	},
	render: function(major){
	    var subjects = major.courses;
	    console.log(subjects);
	    for( var i=0; i<subjects.length; i++){
		var thisSub = subjects[i];
		var course_str = $('#subject_frame').html();
		var $courseFrame = $(course_str);
		$courseFrame.find('.name').text(thisSub[1].name);
		$courseFrame.attr('id', 'course_' + major.id);
		$courseFrame.find('.mark_completed_btn').attr('id', 'completed_btn_' + major.id + '|' + thisSub[0]);
		$courseFrame.find('.edit_subject_btn').attr('id', 'edit_subject_btn_' + major.id + '|' + thisSub[0]);
		$courseFrame.find('.remove_subject_btn').attr('id', 'remove_subject_btn_' + major.id + '|' + thisSub[0]);
		if(thisSub[1].status){
		    $('#courses_lists .completed-list').append($courseFrame);
		}else{
		    $('#courses_lists .remaining-list').append($courseFrame);
		}
	    }
	},
	listenEvents: function(){
	    $('body').on('click', '.edit_subject_btn', function(){
		var id = $(this).attr('id').split('_')[3];
		courseMethods.editCourse(id);
	    });

	    $('body').on('click', '.remove_subject_btn', function(){
		var id = $(this).attr('id').split('_')[3];
		courseMethods.deleteCourse(id);
	    });
	    
	    $('body').on('click','.mark_completed_btn', function(){
		var id = $(this).attr('id').split('_')[2];
		courseMethods.markCompleted(id);
	    });
	}
    };

    loadCourseView.listenEvents();
 
    var createCourseModalView = {
	init: function(){
	    $createCoursesModal.on('shown.bs.modal', function(e){
		
	    });
	    
	    $addCourseBtn.click(function(){
		console.log("Clicked");
		var $input = $('<input type="text" class="form-control default-input">');
		$addCourseForm.append($input);
	    });
	    
	    $addCourseForm.on('submit', function(e){
		e.preventDefault();
		var courses = $addCourseForm.find('input');
		//var name = $('#shopping_list_name').val();
		var formData = '';
		for (var i=0; i<courses.length; i++){
		    formData += $(courses[i]).val() + "," ;
		}
		console.log(formData);
		courseMethods.createCourse('subjects=' + formData);
	    });
	},
	open: function(){
	    console.log("Called");
	    $createCoursesModal.modal("toggle");
	},
	close: function(){
	    $createCoursesModal.modal("hide");
	}
    };

    var courseMethods = {
	createCourse: function(formData){
	    $.ajax({
			url:'/createcourse',
			type: 'POST',
			data: formData,
			dataType: 'json'
	    }).done(function(data){
			console.log(data);
	    });
	},
	deleteCourse: function(id){
	    var data = 'delete=' + id;
	    $.ajax({
			url: '/updatecourse',
			type: 'POST',
			dataType: 'json',
			data: data
	    }).done(function(data){
			if(data.status == 'ERR'){
		    console.log(data.error);
			}
	    });
	},
	markCompleted: function(id){
	    data = 'completed=' + id;
	    $.ajax({
			url: '/updatecourse',
			type: 'POST',
			dataType: 'json',
			data: data
	    }).done(function(data){
		if(data.status == 'ERR'){
		    console.log(data.error);
			}
	    });
	},
	editCourse: function(id){
	
	}
    };
    
    var initilizePage = function(){
	addTaskBtnView.init();
	addTaskModalView.init();
	eventListeners.init();
	createShoppingBtnView.init();
	createShoppingModalView.init();
	createCourseBtnView.init();
	createCourseModalView.init();
    };
    
    initilizePage();
});

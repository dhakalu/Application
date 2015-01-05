$(document).ready(function(){

    var $addTaskBtn = $('#add_task_btn');
    var $createShoppingBtn = $('#create_shopping_btn');
    var $addTaskModal = $('#add_task_modal');
    var $addTaskForm = $('#add_task_form');
    var $createShoppingModal = $('#add_shopping_modal');

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
    

    var sendAddTaskRequest = function(formData){
	console.log('called');
	console.log(formData);
    };

    // ============EVENT LISTENERE =============

    var eventListeners = function(){
	$addTaskForm.submit(function(event){
	    event.preventDefault();
	    addTaskModalView.submit();
	});
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
   
    var createShoppingModalView = {
	init: function(){
	    $createShoppingModal.on('shown.bs.modal', function(e){
		
	    });
	    $createShoppingModal.on('hidden.bs.modal', function(e){
	    
	    });
	    
	    $('#add_items_btn').click(function(){
		console.log("Clicked");
		var $input = $('<input type="text" class="form-control default-input">');
		$addItemsForm.append($input);
	    });

	    $addItemsForm.on('submit', function(e){
		e.preventDefault();
		console.log($addItemsForm.html());
		var items = $addItemsForm.find('input').val();
		console.log(items);
	    });
	    
	},
	open: function(){
	    $createShoppingModal.modal('toggle');
	}, 
	close: function(){
	    $createShoppingModal.modal('hide');
	}
    };
    

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

    var createCourseModalView = {
	init: function(){
	    $createCoursesModal.on('shown.bs.modal', function(e){
		
	    });
	    
	    $addCourseBtn.click(function(){
		console.log("Clicked");
		var $input = $('<input type="text" class="form-control default-input">');
		$addCourseForm.append($input);
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

    var initilizePage = function(){
	addTaskBtnView.init();
	addTaskModalView.init();
	eventListeners();
	createShoppingBtnView.init();
	createShoppingModalView.init();
	createCourseBtnView.init();
	createCourseModalView.init();
    };

    initilizePage();
});

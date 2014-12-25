$(document).ready(function(){
    
    var model = {
	currCat: null,
	cats: ['/pics/cat1.jpg','/pics/cat2.jpg','/pics/cat3.jpg','/pics/cat4.jpg']
    };

    var selectedCatView = {
	init: function(){
	    selectedCatView.render(octupus.getCurrentCat());
	},
	render: function(src){
	    $('#selected_cat').attr('src',src);
	}
    };
   
    var catListView = {
	init: function(){
	    var cats = octupus.getAllCats();
	    for (var i = 0; i<cats.length; i++){
		 var img = new Image(200,200);
		 img.src = cats[i];
		 img.className = 'sidebar_images';
		 catListView.render($(img));
	     }
	},
	render: function(img_dom){
	    $('#image_selector').append(img_dom);
	}
	  
    };

    var octupus = {
	init: function(){
	    model.currCat = model.cats[0];
	    catListView.init();
	    selectedCatView.init();
	},
	getCurrentCat: function(){
	    return model.currCat;
	},
	setCurrentCat: function(cat){
	    model.currCat = cat;
	},
	getAllCats: function(){
	    return model.cats;
	}	
    };

    octupus.init();
     $('.sidebar_images').click(function(){
	 octupus.setCurrentCat($(this).src);
	 selectedCatView.init();
    });
});

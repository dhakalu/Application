$(document).ready(function(){
   var model = {
       init: function(){
	   this.videos = ["https://www.youtube.com/watch?v=dp4Bz_R34MM",
			  "https://www.youtube.com/watch?v=sDne5fEsxec",
			  "https://www.youtube.com/watch?v=3EfX3kAM1Ks",
			  "https://www.youtube.com/watch?v=aYyKvp5oT8Q",
			  "https://www.youtube.com/watch?v=mmV_kWtkbPI"
];
       }
   };
    
    var mainMenuView = {
	init : function(){
	    $('#mainMenu').menu({
		position: {
		    my: 'center top',
		    at: 'center bottom'
		},
		icons: {
		    submenu: 'ui-icon-triangle-1-s'
		}
	    });
	}
    };

    var videoMenuView = {
	
    };
    
    var octupus = {
	init : function(){
	    this.currVideo = model.videos[0];
	}
    };
    
    mainMenuView.init();
});

$(document).ready(function(){
    var model = {
	init : function(){
	   this.otherVids = ["yVCsjMfiZjM",
			 "Tg9e1puvTOs",
			 "Mcbf3P4HPwc",
			 "vern0touq58"
	    ];
	}
    };
    
    var otherVidsView = {
	init: function(){
	    var videos = octupus.getAllVids();
	    for( var i=0; i< octupus.videos.length; i++){
		var imgSrc = 'http://img.youtube.com/vi/'+ videos[i]+ '/default.jpg';
		this.render(imgSrc);
	    } 
	},
	render: function(imgSrc){
	    var $imgFrame = $('<img class="other-vid">');
	    $imgFrame.attr('src', imgSrc);
	    $('#other_video_frame').append($imgFrame);
	}
    };
    
    var octupus = {
	init: function(){
	    model.init();
	    otherVidsView.init();
	},
	getAllVids: function(){
	    return model.otherVids;
	}
    };
    
    octupus.init();
});

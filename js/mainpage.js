$(document).ready(function(){
    var SlideShowObj = function(src, text){
	this.src = src;
	this.text = text;
    };

    var slideObj1 = new SlideShowObj('/pics/pic1.jpg',
				     'Buid your resume');
    var slideObj2 =  new SlideShowObj('/pics/pic2.jpg',
				      'Keep track of your tasks');
    var slideObj3 = new SlideShowObj('/pics/pic3.jpg',
				     'Plan your education ahead');

    var slides = [slideObj1, slideObj2, slideObj3]; 

    var slideShow = {
	init: function(){
	    this.currObj= 0;
	},
	render: function(){
	    var thisObj = slideShow.currObj;
	    console.log(slides[thisObj]);
	    $('.bg').attr('src', slides[thisObj].src);
	    slideShow.currObj = (thisObj + 1) % slides.length;
	}
    };
    slideShow.init();
    setInterval(slideShow.render,3000);
});

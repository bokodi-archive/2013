(function($){
	$.fn.extend({
		clasCarousel: function(options) {
    		return this.each(function() {
				var obj = $(this);
				var images = $("img", obj);
				var num = images.length;
				var actual = 0;
				
				obj.append('<div id="prev"></div><div id="next"></div>');
				images.css('display', 'none');
				images.eq(actual).css('display', 'block');
				
				$("#next").click(function() {
					images.eq(actual).css('display', 'none');
					actual++;
					if (actual == num) {
						actual = 0;
					}
					images.eq(actual).css('display', 'block');
				});
				
				$("#prev").click(function() {
					images.eq(actual).css('display', 'none');
					if (actual == 0) {
						actual = num;
					}
					actual--;
					images.eq(actual).css('display', 'block');
				});
    		});
    	}
	});
})(jQuery);
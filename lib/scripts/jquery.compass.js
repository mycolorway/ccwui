(function ( $ ) {
	
	$.fn.compass = function( options ){
	
		var opts = $.extend({
			range: [0, 360],		//原点向右是0度
			pointer:[],
			degree: null
		}, options );

	};

})( jQuery );

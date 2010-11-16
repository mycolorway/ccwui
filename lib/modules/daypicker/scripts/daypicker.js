//
( function( $ ) {	
	$( function() {
		$( "#startday" ).daypicker({
			selected: 1,		//默认开始日期
			range: [1,30], 		//当月日期范围
			today:0 			//传递当天日期，非本月设置参数为0
		}).bind( "dayselect", function( e, day ) {
			$( this ).text( day );
		});
		
		$( "#endday" ).daypicker({
			selected: 9,		//结束默认日期
			today:0 			//传递当天日期，非本月设置参数为0
		}).bind( "dayselect", function( e, day ) {
			$( this ).text( day );
		});
	});	
})( jQuery );

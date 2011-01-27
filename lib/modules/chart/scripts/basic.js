( function( $ ) {
	$( function() {

		$( "#chart-type1" ).chartdata({
			url: "chart1.json",
			notesURL: "chartNote.json",
			chartId: "chart1",
			params: {
				startDay:"20100101",    //开始日期
				endDay:"20101231",    //结束日期
				timeType:"day"	    //hour,day,month
			},
			path: "../../swfs/",
		});	
	

		$( "#chart-type2" ).chartdata({
			url: "chart2.json",
			notesURL: "chartNote.json",
			chartId: "chart2",
			params: {
				year:"2010",
				timeType:"day",	    //hour,day,month
				selected:"No1"
			},
			path: "../../swfs/",
		});	

	});

})( jQuery );

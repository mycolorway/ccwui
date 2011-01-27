(function($){

	$.fn.chartdata = function(){

		var opts = $.extend({
			url: "",
			notesURL: null,
			chartId: "chart",
			params: {},
			path: "",
			height: "200",
			width: "800",
			creator:"admin"

		}, arguments[0] );

		var chart = $( "<object/>" ).attr("id",opts.chartId).appendTo(this);
		var editArea = $( "<div/>" ).addClass("editArea").appendTo( this );
		var list = $( "<ul/>" ).addClass("annotationList").appendTo( this );

		var hd = $( "<h4/>" ).addClass("hd").appendTo( editArea );
		var creator = $( "<em/>" ).text( opts.creator ).appendTo( hd );
		var dateInput = $( "<span/>" ).appendTo( hd );
		var alink = $( "<a/>", {
			href:"#",
			"class":"word-order"
		}).text("+ 派发工单").appendTo( hd );
		var contentInput = $( "<textarea/>" ).appendTo( editArea );
		var submit = $( "<button/>" ).addClass("btn").text("添加注释").appendTo( editArea );
		var close = $( "<a/>", {
			href:"#",
			"class":"close-btn"
		}).text("取消").appendTo( editArea );

		var count = 0;

		$.ajax({
			url: opts.url, 
			data: opts.params,
			dataType: 'text',
			success: $.proxy( function(data) {
				inputData = data.replace(/^\s*/mg, '').replace(/\r/g, '');

				var flashvars = {
					"input"                 : encodeURIComponent(inputData),
					"annotationsEnabled"    : "true",
					"handCursorEnabled"     : "true",
					"msgAnnotationSingular" : "1 条注释",
					"msgAnnotationsPlural"  : encodeURIComponent("%s 条注释"),
					"msgCreateAnnotation"   : "创建新注释"
				};
				
				var params = {
					menu: "false",
					wmode: "transparent"
				};
				var attributes = {
					id: opts.chartId,
					name: opts.chartId

				};


				swfobject.embedSWF( opts.path + "chart.swf", opts.chartId, opts.width, opts.height, "9.0.0", opts.path + "expressInstall.swf", flashvars, params, attributes);
				
				window.annotations = [];

				window.establishedCommunication = false;
				window.isAllowedToChange = function () {return true;};
				window.addNewAnnotation = function (date) {
					flash.selectDate(null);
					editArea.show();
				};
				window.setSelectedDate = function (date) {
					var datetime = date.toString();
					datetime = datetime.slice(0, 4) + "-" + datetime.slice(4,6) + "-" + datetime.slice(6);
					dateInput.text( datetime );

					list.html('');
					var li;
					$.each( annotations, function(i, val) {
						if (val.date == date) {
							list.show();
							li = $( "<li/>" ).appendTo( list ); 
							var hd = $( "<h4/>" ).addClass("hd").appendTo( li );
							var creator = $( "<em/>" ).text( val.creator ).appendTo( hd );
							var dateInput = $( "<span/>" ).text( datetime ).appendTo( hd );
							$( "<p/>" ).text( val.text ).appendTo( li );
						}
					});
					li.last().addClass("last");

				};

				function establishCommunication() {
					var	flash = $( "#" + opts.chartId )[0];
					if (flash.establishCommunication) {
						window.establishedCommunication = true;
						window.flash = flash;
						var b = {
							'addAnnotations': 1,
							'closeEditedAnnotation': 0,
							'getSelectedDate': 0,
							'getSetUpErrors': 0,
							'openForEdit': 1,
							'removeAnnotations': 1,
							'selectDate': 1,
							'setJson': 1,
							'showAlertHighlight': 1
						};
						var d = {
							'addNewAnnotation': 1,
							'cancelDateSelection':0,
							'isAllowedToChange': 0,
							'openDrawer': 0,
							'openDrawer_': 0,
							'setSelectedDate': 1,
							'waitForFlash': 1
						};
						
						flash.establishCommunication(b, 'window', d, true);

					} else {
						setTimeout(establishCommunication, 100);
					}
				}

				establishCommunication();

			}, this)

		});

		function _notes(){
			$.ajax({
				url: opts.notesURL,
				data: opts.params,
				dataType: 'json',
				success: function( result ) {
					count = result.total;
					var data = result.data;
					$.each(data, function( i, col ){
						var oTime = getLocTime( col.timeStamp );
						var time;
						if( opts.params.timeType == "month" ){
							time = "" + oTime.year + oTime.fullMonth;	
						}else if( opts.params.timeType == "day" ){
							time = "" + oTime.year + oTime.fullMonth + oTime.fullDay;
						}else if( opts.params.timeType == "hour" ){
							time = "" + oTime.year + oTime.fullMonth + oTime.fullDay + " " + oTime.time;
						}else{
							time = col.timeStamp;
						}
						var annotation = {
							"id" : col.id,
							"creator": col.name,
							"date": time,
							"text": col.msg
						};
						annotations.push(annotation);
						flash.addAnnotations($.toJSON(annotation));	
						
					});
					
				}
			
			});
		}

		if( window.flash ){
			_notes();	
		}else{
			var timer = setInterval( function(){
				if( window.flash ){
					clearTimeout( timer );
					_notes();
				}else{
					return;
				}
			}, 100 );
		}

		submit.click(function () {
			count = count + 1;
			var annotation = {
				"id" : count.toString(),
				"creator": opts.creator,
				"date": dateInput.text().replace(/-/g, ""),
				"text": contentInput.val()
			};
			annotations.push(annotation);
			flash.addAnnotations($.toJSON(annotation));
			editArea.hide();
		});

		close.click(function(){
			editArea.hide();
		});

		function getLocTime( timeStamp ){
			if( typeof timeStamp ){
				timeStamp = parseInt( timeStamp );
			}
			var d = new Date( timeStamp );
			var year = d.getFullYear();
			var month = d.getMonth() + 1;
			var day = d.getDate();
			var hour = d.getHours();
			var min = d.getMinutes();
			var fullMonth,fullDay;
			if( hour < 10 ){
				hour = "0" + hour;
			}
			if( min < 10 ){
				min = "0" + min ;
			}
			if( month < 9 ){
				fullMonth =  "0" + month;
			}else{
				fullMonth = month;
			}
			if( day < 10 ){
				fullDay =  "0" + day;
			}else{
				fullDay = day;
			}
			var time = hour + ":" + min;
			return { 
				year: year,
				month: month,
				fullMonth: fullMonth,
				fullDay:fullDay,
				day: day,
				time: time 
			};
		}
	
	};

})(jQuery);

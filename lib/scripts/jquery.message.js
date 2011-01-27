(function( $ ){

	$.widget( "ccw.message", {
		
		options:{
			url:"",
			params:{},
			data:null,
			oTime:{}
		},

		_init: function() {
			var opts = this.options;
			if( !opts.data ){
				//var timeStamp = (new Date()).getTime();
				//var result = this.getLocTime( timeStamp );
				
				//opts.year = result.year;
				//opts.month = result.fullMonth;

				//$.extend( opts.params, {
				//	date: result.year + "" + result.fullMonth
				//});

				$.ajax({
					url: opts.url,
					type: "POST",
					data: opts.params,
					dataType: "json",
					success: $.proxy( function ( result ){
						opts.data = result.data;
						opts.oTime = this.getLocTime( result.today );
						this.year = opts.oTime.year;
						this.month = opts.oTime.fullMonth;
						this.days = result.days;
						this._generateMarkup();
					}, this)
				});

			}
		},

		_generateMarkup:function() {
			var opts = this.options,
				data = opts.data,
				animating = false,
				span,ul;

			span = $( "<span/>" ).addClass( "gz-datetime" ).appendTo( this.element );
			
			var prev = $( "<a/>" ).attr( "href","#" ).addClass( "prev" ).text( "prev" ).appendTo( span );
			var date = $( "<span/>" ).text( this.year + "年" + this.month + "月" ).appendTo( span );
			var next = $( "<a/>" ).attr( "href","#" ).addClass( "next" ).text( "next" ).appendTo( span );
			var link = [],
				li = [],
				content = [],
				selected;
			
			for(var i = 1; i <= this.days; i++ ){
				link[i] = $("<a/>").attr( "href","#" ).text( i ).appendTo( span );
				link[i].click(function(i){
					return function(e){
						e.preventDefault();
						if( !link[i].attr("class") ) { return }
						link[i].addClass( "selected" ).siblings().removeClass( "selected" );
						selected = i;

						if( li.length > 0 ){
							$.each( li, function(n){
								if( li[n].data("day") == selected ){
									li[n].show();
								}else{
									li[n].hide();
								}
							});
						}
						
					};
				}(i));
			}
			
			var that = this;
			//遍历所有msg
			$.each(data,function(i){
				var result = that.getLocTime( data[i].timeStamp );
				link[result.day].addClass("hv-msg");
				content[i] = {
					"name": data[i].name,
					"msg": data[i].msg,
					"day": result.day,
					"time": result.time
				};
			});

			link[opts.oTime.day].click();

			ul = $( "<ul/>" ).addClass( "gz-msg" ).appendTo( this.element );

			for(var j = 0; j < content.length; j++ ){
				
				li[j] = $( "<li/>" ).data( "day", content[j].day ).hide().appendTo( ul );

				if( content[j].day == selected ){
					li[j].show();
				}
				var hd = $( "<div/>" ).addClass( "hd" ).appendTo( li[j] );
				var bd = $( "<div/>" ).addClass( "bd" ).appendTo( li[j] );
				var fd = $( "<div/>" ).addClass( "ft" ).appendTo( li[j] );

				$( "<div/>" ).addClass( "left" ).text( content[j].name ).appendTo( bd )
					.append(  $( "<span/>" ).text( content[j].time ) );

				$( "<p/>" ).addClass( "right" ).text( content[j].msg ).appendTo( bd );
			}

			if( parseInt( this.month, 10 ) == opts.oTime.month && this.year == opts.oTime.year ){
				next.addClass("disable");
			}
			
			prev.mousedown(function(){
				
				if( animating ) return;
				
				animating = true;

				if( parseInt( that.month, 10 )  == opts.oTime.month ) {
					next.removeClass("disable");
				}

				var month = parseInt( that.month, 10 ) - 1;
				var year = parseInt( that.year, 10 );

				if( month < 1 ){
					month = 12 - month ;
					year = year - 1;
				}

				if( month < 10 ){
					month = "0" + month;
				}				
				
				that.year = year;
				that.month = month;
				
				$.extend( opts.params, {
					date: year + "" + month
				});

				$.ajax({
					url: opts.url,
					type: "POST",
					data: opts.params,
					dataType: "json",
					success: $.proxy( function ( result ){
						opts.data = result.data;
						that.days = result.days;
						span.empty().remove();
						ul.empty().remove();
						animating = false;
						that._generateMarkup();
					}, this)
				});

			});

			next.mousedown(function(){

				if( animating || next.hasClass("disable") ) return;
				
				animating = true;

				var month = parseInt( that.month, 10 ) + 1;
				var year = parseInt( that.year, 10 );

				if( month > 12 ){
					month = month - 12;
					year = year + 1;
				}
				
				if( month == opts.oTime.month && year == opts.oTime.year ) {
					next.addClass("disable");
				}

				if( month < 10 ){
					month = "0" + month;
				}



				that.year = year;
				that.month = month;

				$.extend( opts.params, {
					date:parseInt( year + "" + month, 10 )
				});

				$.ajax({
					url: opts.url,
					type: "POST",
					data: opts.params,
					dataType: "json",
					success: $.proxy( function ( result ){
						opts.data = result.data;
						that.days = result.days;
						span.empty().remove();
						ul.empty().remove();
						animating = false;
						that._generateMarkup();
					}, this)
				});

			});

		},

		getLocTime: function( timeStamp ){
			if( typeof timeStamp ){
				timeStamp = parseInt( timeStamp );
			}
			var d = new Date( timeStamp );
			var year = d.getFullYear();
			var month = d.getMonth() + 1;
			var day = d.getDate();
			var hour = d.getHours();
			var min = d.getMinutes();
			var fullMonth, fullDay;
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
				day: day,
				fullDay:fullDay,
				time: time 
			};
		}
	
	});

})(jQuery);

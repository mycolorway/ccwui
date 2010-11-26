( function( $ ) {
    
$.widget( "ccw.tips", {
    
    options: {
        content: "",
        position: "top", 	// valid value: "top", "bottom", "left", "right"
        autoShow: true,		
        autoHide: true,		
        maxWidth: "200px",
        edgeOffset: 3,
        delay: 3000,		//自动消失时间
        fadeIn: 200,
        fadeOut: 200,
        follow: true,
        color: "red", 		// valid value: "green", "red", "blue", "black"
        closeOnClick: true
    },
    
	//初始化
    _init: function() {
        var opts = this.options;
        
        if ( !opts.content ) {
            opts.content = this.element.attr( "title" );
            this.element.removeAttr( "title" );
        }
        
		//TODO
        opts.autoShow && this.show();
    },
    
	//定义 show 方法
    show: function() {
        var opts = this.options;
        
        this.hide();
        
        if ( opts.color == "green" ) {
            opts.color = "#62bb02";
        } else if ( opts.color == "red" ) {
            opts.color = "#ed5554";
        } else if ( opts.color == "yellow" ) {
            opts.color = "#ffa525";
        } else if ( opts.color == "black" ) {
            opts.color = "#333333";
        } else if ( opts.color == "blue" ) {
            opts.color = "#25a0e7";
        }
        
        this.tipArrow = $( '<div class="tip-arrow"></div>' )
            .append( '<div class="tip-arrow-inner"></div>' );
        
        this.tipContent = $( '<div class="tip-content"></div>' )
            .css( "background-color", opts.color )
            .html( opts.content );
        
        this.tipHolder = $( '<div class="tip-holder"></div>' )
            .css( "max-width", opts.maxWidth )
            .append( this.tipArrow )
            .append( this.tipContent )
            .appendTo( "body" )
            .click( $.proxy( function() {
                this.hide();
            }, this ));
        
        this.updatePosition();
        //TODO
        this.tipHolder.stop( true, true )
            .fadeIn( opts.fadeIn );
		
		//TODO this 
        if ( opts.follow ) {
            this.positionTimer = setInterval( $.proxy( function() {
                this.updatePosition();
            }, this), 200 );
        }
        
        if ( opts.autoHide ) {
            setTimeout( $.proxy( function() {
                this.hide();
            }, this), opts.delay );
        }
    },
    
	//Hide 方法
    hide: function() {
        clearTimeout( this.positionTimer );
        this.tipHolder && this.tipHolder.stop( true, true )
            .fadeOut( this.options.fadeOut, function() {
                $( this ).remove();
            });
    },

	//更新坐标
    updatePosition: function() {
        var opts = this.options;
        var top = parseInt( this.element.offset()['top'] );
        var left = parseInt( this.element.offset()['left']);
        var elW = parseInt( this.element.width());
        var elH = parseInt( this.element.height());
        var tipW = this.tipHolder.width();
        var tipH = this.tipHolder.height();
        var wCompare = Math.round(( elW - tipW ) / 2 );
        var hCompare = Math.round(( elH - tipH) / 2 );
        var marginLeft = Math.round( left );
        var marginTop = Math.round( top + elH + opts.edgeOffset );
        var position = opts.position ? "-" + opts.position : "";
        var arrowTop = "";
        var arrowLeft = 12;

        if ( !position ) {
            if( wCompare < 0 ){
                if(( wCompare + left ) < parseInt( $( window ).scrollLeft())){
                    position = "-right";
                } else if(( tipW + left ) > parseInt( $( window ).width())){
                    position = "-left";
                }
            }

            if(( top + elH + opts.edgeOffset + tipH + 8) > parseInt( $( window ).height() + $( window ).scrollTop())){
                position = position + "-top";
            } else if((( top + elH ) - ( opts.edgeOffset + tipH )) < 0 || position == ""){
                position = position+"-bottom";
            }
        }

        if ( position.indexOf( "-right" ) > -1 ) {
            arrowTop = 5;
            arrowLeft = -10;
            marginLeft = Math.round( left + elW + opts.edgeOffset ) + 10;
            marginTop = Math.round( top );
        } else if ( position.indexOf( "-left" ) > -1 ) {
            arrowTop = 5;
            arrowLeft =  Math.round( tipW );
            marginLeft = Math.round( left - ( tipW + opts.edgeOffset + 5 ));
            marginTop = Math.round( top );
        } else if ( position.indexOf( "-top" ) > -1 ) {
            arrowTop = tipH;
            marginTop = Math.round( top - ( tipH + 3 + opts.edgeOffset ));
        } else if ( position.indexOf( "-bottom" ) > -1 ) {
            arrowTop = -12;
            marginTop = Math.round( top + elH + opts.edgeOffset ) + 10;
            marginTop -= 5;
        }
        
        this.tipArrow.css({
            "margin-left": arrowLeft + "px",
            "margin-top": arrowTop + "px"
        });
        
        this.tipArrow.find( ".tip-arrow-inner" )
            .css( "border" + position + "-color", opts.color );
        
        this.tipHolder.css({
            "margin-left": marginLeft + "px",
            "margin-top": marginTop + "px"
        }).addClass( "tip" + position );
    }
});

}( jQuery ));


;( function( $ ) {
    
var el = null,
    btnTemplates = {
    button: '<a class="btn dialog-btn" href="#"><span>#{text}</span></a>',
    link: '<a class="dialog-link" href="#">#{text}</a>',
    text: '<span class="dialog-text">#{text}</span>'
};

$.dialog = function() {
    
    if ( typeof arguments[0] == "object" ) {
        var opts = $.extend({
            title: "",
            content: null,
            width: 300,
            height: "auto",
            draggable: false,
            resizable: false,
            modal: true,
            minHeight: 100,
            minWidth: "auto",
            buttons: []
        }, arguments[0] );
        
        if ( !el ) {
            el = $( "<div/>", {
                "class": "dialog-container"
            }).appendTo( "body" );
        }
        
        el.empty().append( opts.content );
        if ( $.isArray( opts.buttons ) && opts.buttons.length > 0 ) {
            el.append( _generateButtons( opts.buttons ));
        }
        
        el.dialog( "destroy" ).dialog({
            title: opts.title,
            width: opts.width,
            height: opts.height,
            draggable: opts.draggable,
            resizable: opts.resizable,
            modal: opts.modal,
            minHeight: opts.minHeight,
            minWidth: opts.minWidth
        });
    
    } else if ( typeof arguments[0] == "string" && arguments[0] == "close" ) {
        if ( el ) {
            el.dialog( "close" )
                .dialog( "destroy" );
        }
    }
};

function _generateButtons( buttons ) {
    var bar = $( "<div/>", {
        "class": "dialog-buttons"
    });
    
    var inner = $( "<div/>", {
        "class": "dialog-buttons-inner"
    }).appendTo( bar );
    
    $.each( buttons, function( i, b ) {
        if ( b.type == "text" ) {
            $( btnTemplates.text.replace( /#\{text\}/g, b.text ))
                .addClass( b.align )
                .appendTo( inner );
        } else {
            b.type = b.type || "button";
            $( btnTemplates[b.type].replace( /#\{text\}/g, b.text ))
                .addClass( b.align )
                .appendTo( inner )
                .click( function( e ) {
                    e.preventDefault();
                    if ( $.isFunction( b.handler )) {
                        b.handler.call( this, e );
                    }
                });
        }
    });
    
    return bar;
}


})( jQuery );

;( function( $ ) {
    
$( function() {
    
    $( ".form" ).validate({
        fields: {
            "txt-required": {
                required: true
            },
            "txt-max-length": {
                maxLength: 5
            },
            "txt-digits-max": {
                digits: true,
                max: 100
            },
            "txt-email": {
                email: true
            },
            "txt-url": {
                url: true
            },
            "txt-password": {
                required: true,
                minLength: 6
            },
            "txt-confirm-password": {
                equalTo: "txt-password",
                msg: "两次输入的密码不一致"
            },
            "radio-status": {
                required: true,
                position: "top"
            },
            "cb-group": {
                required: true,
                position: "top"
            }
        },
        error: function( e, field ) {
            var tipEl = field.el;
            
            if ( tipEl.is( "input:checkbox, input:radio" )) {
                tipEl = tipEl.parents( ".field-input" );
            }
            
            tipEl.tips({
                content: field.msg,
                position: "right",
                color: "red",
                autoHide: false
            });
        },
        valid: function( e, field ) {
            field.el.tips( "hide" );
        }
    });
    
    $( "#btn-save" ).click( function( e ) {
        $( ".form" ).validate( "validate" );
    });
    
    $( "#link-reset" ).click( function( e ) {
        e.preventDefault();
        $( ".form" ).validate( "reset" )
            .find( "input:text, input:password" )
            .val( "" );
    });
    
});

})( jQuery );

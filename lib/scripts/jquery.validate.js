
;( function( $ ) {
    
$.fn.validate = function( opts ) {
    
    if ( typeof opts == "object" ) {
        this.each( function() {
            var el = $( this ).data( "opts", opts );
        
            $.each( opts, function( name, config ) {
                var field = el.find( "[name=" + name + "]" );
                if ( field.is( "input:text, input:password, textarea" )) {
                    field.blur( function( e ) {
                        _validateField(  field, config, el );
                    });
                } else if ( field.is( "input:checkbox, input:radio" )) {
                    field.click( function( e ) {
                        _validateField(  field, config, el );
                    });
                }
            });
        });
        
    } else if ( typeof opts == "string" && opts == "validate" ) {
        var el = this.first();
        var opts = el.data( "opts" );
        if ( !opts ) {
            return true;
        }
        
        el.validate( "reset" );
        
        var valid = true;
        $.each( opts, function( name, config ) {
            var field = el.find( "[name=" + name + "]" );
            if ( !_validateField( field, config, el )) {
                valid = false;
            };
        });
        
        return valid;
    } else if ( typeof opts == "string" && opts == "reset" ) {
        var el = this.first();
        if ( $.fn.tips ) {
            $( ".tip-holder" ).remove();
        } else {
            el.find( ".field-error" ).remove();
        }
        
        el.find( ".form-field-error" )
            .removeClass( "form-field-error" );
    }
    
    return this;
}

function _validateField( field, config, el ) {
    var valid = true,
        msg = "";
    
    $.each( config, function( vType, param ) {
        var result = null;
        if ( vType == "equalTo" ) {
            result = {
                valid: fieldValue( field ) == fieldValue( el.find(  "[name=" + param + "]" )),
                errorMsg: "该字段与“" + param + "”不同"
            };
        } else if ( vType == "remote" ) {
            //TODO:remote validation
        } else if ( vType != "msg" && vType != "position" ) {
            result = $.validate[vType]( fieldValue( field ) || "", param );
        }
        
        if ( result && !result.valid ) {
            valid = false;
            msg = config.msg || result.errorMsg;
            return false;
        }
    });
    
    var formField = field.first().closest( ".form-field" );
    if ( !valid ) {
        if ( $.fn.tips ) {
            field.first().tips({
                position: config.position || "right",
                content: msg,
                autoHide: false
            });
        } else {
            var fieldError = formField.find( ".field-error" );
            if ( !fieldError.length ) {
                fieldError = $( "<div/>", {
                    "class": "field-error"
                }).appendTo( formField );
            }
            fieldError.text( msg );
        }
        
        formField.addClass( "form-field-error" );
    } else {
        formField.removeClass( "form-field-error" );
        if ( $.fn.tips ) {
            field.tips( "hide" );
        } else {
            var fieldError = formField.find( ".field-error" );
            fieldError.remove();
        }
    }
    
    return valid;
}

function fieldValue( field ) {
    if ( field.is( "input:checkbox, input:radio" )) {
        var result = [];
        field.filter( ":checked" ).each( function( i, f ) {
            result.push( $( f ).val());
        });
        return result;
    } else {
        return field.val();
    }
}

$.validate = {
    required: function( value, param ) {
        return {
            valid: !param || value.length > 0,
            errorMsg: $.validate.errorMsg.required
        };
    },
    
    minLength: function( value, param ) {
        var length = value.length;
        return {
            valid: length ? length >= param : true,
            errorMsg: $.validate.errorMsg.minLength.replace( /#\{min\}/g, param )
        };
    },
    
    maxLength: function( value, param ) {
        var length = value.length;
        return {
            valid: length ? length <= param : true,
            errorMsg: $.validate.errorMsg.maxLength.replace( /#\{max\}/g, param )
        };
    },
    
    rangeLength: function( value, param ) {
        var length = value.length;
        return {
            valid: length ? ( length >= param[0] && length <=param[1] ) : true,
            errorMsg: $.validate.errorMsg.rangeLength.replace( /#\{min\}/g, param[0] ).replace( /#\{max\}/g, param[1] )
        };
    },
    
    min: function( value, param ) {
        return {
            valid: value >= param,
            errorMsg: $.validate.errorMsg.min.replace( /#\{min\}/g, param )
        };
    },
    
    max: function( value, param ) {
        return {
            valid: value <= param,
            errorMsg: $.validate.errorMsg.max.replace( /#\{max\}/g, param )
        };
    },
    
    range: function( value, param ) {
        return {
            valid: ( value >= param[0] && value <= param[1] ),
            errorMsg: $.validate.errorMsg.range.replace( /#\{min\}/g, param[0] ).replace( /#\{max\}/g, param[1] )
        };
    },
    
    regExp: function( value, param ) {
        // TODO
    },
    
    email: function( value, param ) {
        return {
            // contributed by Scott Gonzalez: http://projects.scottsplayground.com/email_address_validate/
            valid: !param || !value || /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i.test( value ),
            errorMsg: $.validate.errorMsg.email
        };
    },
    
    url: function( value, param ) {
        return {
            // contributed by Scott Gonzalez: http://projects.scottsplayground.com/iri/
            valid: !param || !value || /^(https?|ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i.test( value ),
            errorMsg: $.validate.errorMsg.url
        };
    },
    
    date: function( value, param ) {
        return {
            valid: !param || !/Invalid|NaN/.test( new Date( value )),
            errorMsg: $.validate.errorMsg.date
        };
    },

    dateISO: function( value, param ) {
        return {
            valid: !param || /^\d{4}[\/-]\d{1,2}[\/-]\d{1,2}$/.test( value ),
            errorMsg: $.validate.errorMsg.dateISO
        };
    },

    number: function( value, param ) {
        return {
            valid: !param || /^-?(?:\d+|\d{1,3}(?:,\d{3})+)(?:\.\d+)?$/.test( value ),
            errorMsg: $.validate.errorMsg.number
        };
    },

    digits: function( value, param ) {
        return {
            valid: !param || /^\d+$/.test( value ),
            errorMsg: $.validate.errorMsg.digits
        };
    }
};

$.validate.errorMsg = {
    required: "该字段不能为空",
    minLength: "该字段的长度不能小于#{min}",
    maxLength: "该字段的长度不能大于#{max}",
    rangeLength: "该字段的长度必须在#{min}和#{max}之间",
    min: "该字段的值不能小于#{min}",
    max: "该字段的值不能大于#{max}",
    range: "该字段的值必须在#{min}和#{max}之间",
    email: "这不是一个标准的Email地址",
    url: "这不是一个标准的url地址",
    date: "这不是一个标准的日期格式",
    dateISO: "这不是一个标准的ISO日期格式",
    number: "该字段只能为数字",
    digits: "该字段只能为数字"
};
    
})( jQuery );
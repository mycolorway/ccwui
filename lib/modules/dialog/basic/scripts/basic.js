
( function( $ ) {
    
$( function() {
    
    $( "#btn-dialog-1" ).click( function( e ) {
        e.preventDefault();
        $.dialog({
            title: "简单的弹出对话框",
            content: "<p>简单很简单非常简单的弹出对话框<p><br/><p>好用很好用非常好用的弹出对话框<p>"
        });
    });
    
    $( "#btn-dialog-2" ).click( function( e ) {
        e.preventDefault();
        $.dialog({
            title: "简单的弹出对话框",
            content: $( "#dialog-content" ).clone()[0],
            width: 400,
            height: 200
        });
    });
    
    $( "#btn-dialog-3" ).click( function( e ) {
        e.preventDefault();
        $.dialog({
            title: "简单的弹出对话框",
            content: $( "#dialog-content" ).clone()
        });
    });
    
    
});

})( jQuery );

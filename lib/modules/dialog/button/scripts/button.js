
( function( $ ) {
    
$( function() {
    
    $( "#btn-dialog-1" ).click( function( e ) {
        e.preventDefault();
        $.dialog({
            title: "带button的Dialog",
            content: "<p>简单很简单非常简单的弹出对话框<p><br/><p>好用很好用非常好用的弹出对话框<p>",
            width: 300,
            buttons: [{
                text: "普通链接",
                type: "link",
                align: "right",
                handler: function() {}
            }, {
                text: "或者",
                align: "right",
                type: "text"
            }, {
                text: "普通按钮",
                align: "right",
                handler: function() {}
            }]
        });
    });
    
});

})( jQuery );

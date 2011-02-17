//调用方法   $.modal(command, options);
//command 是为了给弹出层添加一个 class, 用 css 来控制该弹出层的样式。
//autoHide：自动消失时间，msg:弹出层显示的文字
//
( function( $ ) {	
	$( function() {
        $( "#loading" ).click( function( e ){
            $.modal( "modal-loading", {
                autoHide: 5000,
                msg: "提交中，请稍后..."                
            });
        });
        $( "#success" ).click( function( e ){
            $.modal( "modal-success", {
                autoHide: 1000,
                msg: "提交成功"                
            });
        });
        $( "#error" ).click( function( e ){
            $.modal( "modal-error", {
                autoHide:50000,
                msg: "提交失败"                
            });
        });
			
    });	
})( jQuery );

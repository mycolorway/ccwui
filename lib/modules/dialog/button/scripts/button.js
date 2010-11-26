//调用 $.dialog(options);
//options 可选的参数,默认值为：
//title: "",    		//标题
//content: null,		//内容
//width: 300,			//容器宽
//height: "auto",		//容器高
//draggable: false,		//是否拖动
//resizable: false,		//是否拖动改变容器大小
//modal: true,			//是否有遮罩
//minHeight: 100,		//容器最小高度
//minWidth: "auto",		//容器最小宽度
//buttons: []			//按钮  buttons[{
//								text:"按钮文字"，
//								type:"按钮类型（可选参数：link,text,button），默认为 button"，
//								align:"对齐方式"，
//								handler:function(){自定义函数}
//								}]
//$.dialog("colse");  //关闭弹出窗口
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
                handler: function() {$.dialog( "close" );}
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

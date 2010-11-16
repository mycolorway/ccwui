
( function( $ ) {
    
$( function() {
    $( ".treegrid" ).grid({
        url: "data.json",
        columns: [
            { "header": "部门", "dataIndex": "name" },
            { "header": "本月创单量", "dataIndex": "current", "width": 100, "align": "right" },
            { "header": "同比", "dataIndex": "tongbi", "width": 100, "align": "right", "renderer": ratioRenderer },
            { "header": "环比", "dataIndex": "huanbi", "width": 100, "align": "right", "renderer": ratioRenderer }
        ],
        border: true,
        rowover: true,
        selectable: true,
        tree: true
    });
});

function ratioRenderer( val, parent, colIndex, node, col ) {
    var span = $( "<span/>", {
        "class": val > 0 ? "increase" : "decrease",
        text: ( val > 0 ? "+" : "" ) + val + "%"
    });
    return span;
}

})( jQuery );

/*
    Copyright (C) 2010 mycolorway.com
    All rights reserved
    script for tab component
*/

( function( $ ) {
    
$( function() {
    $( ".grid" ).grid({
        url: "data.json",
        columns: [
            { "header": "指标名称", "dataIndex": "name" },
            { "header": "指标值", "dataIndex": "current", "width": 100, "align": "right" },
            { "header": "状态", "dataIndex": "status", "width": 100, "align": "right" },
            { "header": "环比", "dataIndex": "ring", "width": 100, "align": "right" }
        ],
        border: true
    });
});

})( jQuery );

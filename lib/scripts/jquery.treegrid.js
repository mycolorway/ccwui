
;( function( $ ) {

$.widget( "ccw.treegrid", {
    
    options: {
        url: "",
        params: {},
        data: null,
        columns: [],
        border: "",
        stripe: true,
        rowover: false,
        selectable: false,
        holderSize: 16
    },
    
    _init: function() {
        var opts = this.options;
        
        this.element.addClass( "tree-grid" );
        
        if ( opts.border ) {
            if ( opts.border === true ) {
                this.element.css( "border-width", "1px" );
            } else {
                this.element.css( "border-width", opts.border );
            }
        }
        
        if ( opts.columns ) {
            this._generateMarkup();
        }
        
        if ( opts.data ) {
            this.add( opts.data );
            this._refreshStripe();
        } else {
            $.ajax({
                url: opts.url,
                type: "POST",
                data: opts.params,
                dataType: "json",
                success: $.proxy( function( result ) {
                    if ( this.element.find( "table" ).length == 0
                        && result.columns ) {
                        opts.columns = result.columns;
                        this._generateMarkup();
                    }
                    
                    opts.data = result.data;
                    this.add( opts.data );
                    this._refreshStripe();
                }, this )
            });
        }
    },
    
    _generateMarkup: function() {
        var opts = this.options;
        var tableWrapper = $( "<div/>", {
            "class": "data-table-wrapper"
        });
        var table = $( "<table/>", {
            "class": "data-table"
        }).appendTo( tableWrapper );
        var colGroup = $( "<colgroup/>" ).appendTo( table );
        var thead = $( "<thead/>" ).appendTo( table );
        var hrow = $( "<tr/>" ).appendTo( thead );
        var tbody = $( "<tbody/>" ).appendTo( table );
        
        $.each( opts.columns, function( index, config ) {
            var col = $( "<col/>" )
                .data( "config", config )
                .appendTo( colGroup );
            if ( config.width ) {
                col.attr( "width", config.width );
            }
            
            var th = $( "<th/>" ).text( config.header );
            if ( config.align || config.headerAlign ) {
                th.css( "text-align", config.headerAlign || config.align );
            }
            
            if ( index == 0 ) {
                th.addClass( "first" );
            } else if ( index == opts.columns.length - 1 ) {
                th.addClass( "last" );
            }
            
            hrow.append( th );
        });
        
        this.element.append( tableWrapper );
        
        this._initEvents();
    },
    
    _initEvents: function() {
        var opts = this.options;
        var tbody = this.element.find( "tbody" );
        
        if ( opts.rowover ) {
            $( "tr", tbody[0] ).live( "mouseenter", function( e ) {
                $( this ).css({
                    cursor: "pointer"
                }).addClass( "over" );
            });
            
            $( "tr", tbody[0] ).live( "mouseleave", function( e ) {
                $( this ).css({
                    cursor: "default"
                }).removeClass( "over" );
            });
        }
        
        if ( opts.selectable ) {
            $( "tr", tbody[0] ).live( "click", $.proxy( function( e ) {
                e.preventDefault();
                var row = $( e.currentTarget )
                row.addClass( "selected" )
                    .siblings()
                    .removeClass( "selected" );
                
                this.element.trigger( "rowselect", {
                    index: tbody.find( "tr" ).index( row ),
                    data: row.data( "data" )
                });
            }, this ));
        }
        
        $( "tr", tbody[0] ).live( "click", $.proxy( function( e ) {
            e.preventDefault();
            var row = $( e.currentTarget );
            this.element.trigger( "rowclick", {
                index: tbody.find( "tr" ).index( row ),
                data: row.data( "data" )
            });
        }, this ));
        
        $( "tr", tbody[0] ).live( "dblclick", $.proxy( function( e ) {
            e.preventDefault();
            var row = $( e.currentTarget );
            this.toggle( row );
            this.element.trigger( "rowdblclick", {
                index: tbody.find( "tr" ).index( row ),
                data: row.data( "data" )
            });
        }, this ));
        
    },
    
    _refreshStripe: function() {
        this.element.find( "tbody tr" )
            .removeClass( "even" )
            .filter( ":odd" )
            .addClass( "even");
    },
    
    _nodeId: function() {
        if ( !this.lastId ) {
            this.lastId = 0;
        }
        return ++this.lastId;
    },
    
    _childNodes: function( parent ) {
        if ( typeof parent != "string" ) {
            parent = $( parent ).attr( "nodeid" );
        }
        
        return this.element.find( "tbody tr[parentid=" + parent + "]" );
    },
    
    _descendants: function( parent ) {
        var children = this._childNodes( parent );
        $.each( children, $.proxy( function( i, c ) {
            children = children.add( this._descendants( c ));
        }, this ));
        
        return children;
    },
    
    toggle: function( node ) {
        node = $( node );
        if ( !node.hasClass( "node-parent" )) {
            return;
        }
        
        var descendants = this._descendants( node );
        if ( node.hasClass( "node-collapsed" )) {
            node.removeClass( "node-collapsed" )
                .addClass( "node-expanded" );
            descendants.each( function( i, d ) {
                d = $( d );
                d.data( "visible" ) === false ? d.hide() : d.show();
                d.removeData( "visible" );
            });
        } else if ( node.hasClass( "node-expanded" )) {
            node.removeClass( "node-expanded" )
                .addClass( "node-collapsed" );
            descendants.each( function( i, d ) {
                d = $( d );
                d.data( "visible", d.is( ":visible" ))
                    .hide();
            });
        }
    },
    
    collapse: function( node ) {
        node = $( node );
        if ( !node.hasClass( "node-parent" )) {
            return;
        }
        
        var descendants = this._descendants( node );
        node.removeClass( "node-expanded" )
            .addClass( "node-collapsed" );
        descendants.hide();
    },
    
    collapseAll: function() {
        var parents = this.element.find( "tbody tr.node-parent" );
        parents.each( $.proxy( function( index, node ) {
            this.collapse( node )
        }, this ));
    },
    
    expand: function( node ) {
        node = $( node );
        if ( !node.hasClass( "node-parent" )) {
            return;
        }
        
        var descendants = this._descendants( node );
        node.removeClass( "node-collapsed" )
            .addClass( "node-expanded" );
        descendants.show();
    },
    
    expandAll: function() {
        var parents = this.element.find( "tbody tr.node-parent" );
        parents.each( $.proxy( function( index, node ) {
            this.expand( node )
        }, this ));
    },
    
    add: function( node, parent ) {
        if ( $.isArray( node )) {
            $.each( node, $.proxy( function( i, d ) {
                this.add( d, parent );
            }, this ));
            return;
        }
        
        if ( parent && typeof parent == "string" ) {
            if ( typeof parent == "string" ) {
                parent = this.element.find( "tbody tr[nodeid=" + parent + "]" );
            } else {
                parent = $( parent );
            }
        }
        
        var opts = this.options;
        var tr = $( "<tr/>" ).data( "data", node );
        var cols = this.element.find( "col" );
        var depth = parent ? parent.attr( "depth" ) * 1 + 1 : 0;
        
        tr.attr({
            nodeid: this._nodeId(),
            parentid: parent ? parent.attr( "nodeid" ) : undefined,
            depth: depth
        });
        
        $.each( cols, $.proxy( function( colIndex, col ) {
            var config = $( col ).data( "config" );
            var td = $( "<td/>" );
            var container = td;
            
            if ( config.align ) {
                td.css( "text-align", config.align );
            }
            
            if ( colIndex == 0 ) {
                td.addClass( "first" )
                    .attr( "unselectable", "on" );
                var toggler = $( "<img/>", {
                    src: "images/blank.gif",
                    "class": "node-toggler",
                    css: {
                        "margin-left": depth * opts.holderSize
                    }
                }).hover(
                    function() {
                        $( this ).addClass( "node-toggler-over" );
                    },
                    function() {
                        $( this ).removeClass( "node-toggler-over" );
                    }
                ).click( $.proxy( function( e ) {
                    e.preventDefault();
                    e.stopPropagation();
                    this.toggle( $( e.currentTarget ).closest( "tr" ));
                }, this )).prependTo( td );
                
                var container = $( "<div/>" )
                    .addClass( "node-wrapper" )
                    .attr( "unselectable", "on" )
                    .appendTo( td );
                
                if ( $.isArray( node.children ) && node.children.length > 0 ) {
                    if ( opts.collapsed || node.collapsed ) {
                        tr.addClass( "node-collapsed" );
                    } else {
                        tr.addClass( "node-expanded" );
                    }
                    
                    tr.addClass( "node-parent" );
                }
            } else if ( colIndex == cols.length - 1 ) {
                td.addClass( "last" );
            }
            
            var val = node[config.dataIndex];
            var content = val;
            if ( typeof config.renderer == "function" ) {
                content = config.renderer.apply( td, [val, parent, colIndex, node, config] );
            } else if ( typeof config.renderer == "string" ) {
                content = eval( config.renderer ).apply( td, [val, parent, colIndex, node, config] );
            }
            
            if( $.isArray( content )) {
                $.each( content, function( index, item ) {
                    container.append( item );
                });
            } else {
                container.append( content );
            }
            
            tr.append( td );
        }, this ));
        
        if ( parent ) {
            var descendants = this._descendants( parent );
            if ( descendants.length > 0 ) {
                descendants.last().after( tr );
            } else {
                parent.after( tr );
            }
            
            parent.addClass( "node-parent" );
        } else {
            this.element.find( "tbody" )
                .append( tr );
        }
        
        if ( $.isArray( node.children ) && node.children.length > 0 ) {
            $.each( node.children, $.proxy( function( i, c ) {
                this.add( c, tr );
            }, this ));
        }
    }
    
});
    
})( jQuery );
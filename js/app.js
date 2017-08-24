'use strict';

//Configure require.js
require.config({
  shim: {
    underscore: {
      exports: '_'
    },
    backbone: {
      deps: [
        'underscore',
        'jquery'
      ],
      exports: 'Backbone'
    }, 
    marionette: {
        deps: [
            'jquery',
            'underscore',
            'backbone',
            'underscore',
            'backbone.radio'
        ],
        exports: 'Mn'
    }
  },
  paths: {
      jquery: 'libs/jquery-3.2.1',
      underscore: 'libs/underscore-min',
      backbone: 'libs/backbone-min',
      text: 'libs/text',
      'backbone.radio': 'libs/backbone.radio',
      marionette: 'libs/backbone.marionette'
  }
});

//Start up our App
require([    
    'backbone',
    'marionette',
    'backbone.radio',
    'view/block',
    'view/text'
], 
function (Bb, Mn, Radio, BlockMainView, mpText) {
    var colBlocks = new Bb.Collection([{id:0, cat: "1", block: 'block1-1'}, 
                                      {id:1, cat:"2", block: 'block2-1'}, 
                                      {id:2, cat:"2", block: 'block2-2'},
                                      {id:3, cat:"3", block: 'block3-1'}]);
        
    var ModalRegion = Mn.Region.extend({
        removeView: function(view){
            this.destroyView(view);
        },
        attachHtml: function(view){
            // Some effect to show the view:
            this.$el.empty().append(view.el);
            this.$el.hide().slideDown('fast');
        }
    });
    
    var Menu = Mn.View.extend({
        el: ".menu",
        template: _.noop,
        events: {
            "click div": "clickItem"
        },
        onRender: function() {
            this.oRow = undefined;            
        },
        show: function(oRow, sAction) {            
            this.oRow = oRow;
            this.sAction = sAction;
            this.trigger = (sAction === "row") ? oRow.$addRow[0] : oRow.$addCell[0];
            
            var pos = this.trigger.getBoundingClientRect();
            
            this.$el.css({top: pos.top + 25, left: pos.left}).show();
        },
        clickItem: function(event) {
            var me = this;
            var method = (this.sAction === "row") ? this.oRow.addRow: this.oRow.addCell;
            
            switch (event.currentTarget.innerText) {
                case "Text":
                    method.call(this.oRow, "Enter text here");
                    break;
                case "Image":
                    method.call(this.oRow, "<img src='https://pbs.twimg.com/profile_images/715995939752775681/ABFhhNE4.jpg' />");
                    break;
                case "Button":
                    method.call(this.oRow, "<button>Click Me</button>");
                    break;
            }
            
            me.$el.hide();
        }
    });
    
    var Row = Mn.View.extend({
        template: _.noop,
        onRender: function(){
            var me = this;
            
            this.$addRow = $("<div class='js_add_row'><div>+</div></div>");
            this.$addCell = $("<div class='js_add_cell'>+</div>");
            this.$el.append(this.$addRow);
            this.$el.append(this.$addCell);
            this.$el.find(".cell").each(function() {
                var view = new Cell({el: this});
                view.render();                
            });
            
            this.$addRow.click(function(){
                window.menu.show(me, "row");
                /*
                var $newRow = $("<div class='row js_row'><div class='cell col-12'>Text</div></div>");
                me.$el.after($newRow);
                new Row({el: $newRow[0]}).render();                    
                */
            });
            
            this.$addCell.click(function(){
                window.menu.show(me, "cell");
                /*
                var $newCell = $("<div class='cell'>Text</div>");
                me.$el.append($newCell);
                new Cell({el: $newCell[0]}).render();                    
                me.splitCol();
                */
            });    
            
            this.$el.data("cell" ,this);
        }, 
        addCell: function(sHtml) {
            var me = this;
            var $newCell = $("<div class='cell'>" + sHtml + "</div>");
            
            me.$el.append($newCell);
            new Cell({el: $newCell[0]}).render();                    
            me.splitCol();
        },
        addRow: function(sHtml) {
            var me = this;
            var $newRow = $("<div class='row js_row'><div class='cell col-12'>" + sHtml + "</div></div>");
            
            me.$el.after($newRow);
            new Row({el: $newRow[0]}).render();                    
        },
        splitCol: function() {
            var me = this, arrCell = me.$el.find(".cell");
            var iSize = Math.floor(12 / arrCell.length);
            
            arrCell.each(function(){
                $(this).data("cell").changeCellCol(iSize);
            })
            console.log(iSize);
        }
    });
    
    var Cell = Mn.View.extend({
        template: _.noop,
        onRender: function(){        
            var me = this;
            
            this.$el.addClass("js_cell");
            this.$col = $("<div class='js_cell_col'>" + this.generateColDropdown() + "</div>");
            this.$sel = this.$col.find("select");
            this.$sel.change(function() {
                me.changeCellCol(this.value);
            });
            this.$el.append(this.$col);
            /*
            this.$el.append("<div class='js_add_row'>+</div>");
            this.$el.append("<div class='js_add_cell'>+</div>");
            */
            
            this.$el.data("cell" ,this);
            this.onUpdateCol( this.findCol(this.$el.css("flex")) );
        },
        generateColDropdown: function() {
            return "<select><option value='1'>1</option><option value='2'>2</option><option value='3'>3</option><option value='4'>4</option>" +
                "<option value='5'>5</option><option value='6'>6</option><option value='7'>7</option><option value='8'>8</option>" + 
                "<option value='9'>9</option><option value='10'>10</option><option value='11'>11</option><option value='12'>12</option></select>";
        },
        changeCellCol: function(iSize) {
            var me = this;
            
            me.$el.removeClass(function(i, sClass) {                    
                var classes = sClass.split(" ");
                var remove = [];

                $.each(classes, function() {
                    if (window.device === "" && this.match(new RegExp("col-\\d"))) {
                        remove.push(this);
                    }
                    else if (this.match(new RegExp("col-"+window.device+"-\\d"))) {
                        remove.push(this);
                    }
                });

                return remove.join(" ");
            });    

            me.$el.addClass("col" + ((window.device === "") ? "": "-" + window.device) + "-" + iSize);
            me.$sel.val(iSize);
        },
        onUpdateCol: function() {
            this.$sel.val( this.findCol(this.$el.css("flex")) );
        },
        findCol: function() {
            switch( parseInt(this.$el.css("flex").split(" ")[2]) ){
                case 8:
                    return 1;
                case 16:
                    return 2;
                case 25:
                    return 3;
                case 33:
                    return 4;
                case 41:
                    return 5;
                case 50:
                    return 6;
                case 58:
                    return 7;
                case 66:
                    return 8;
                case 75:
                    return 9;
                case 83:
                    return 10;
                case 91:
                    return 11;
                case 100:
                    return 12;
                default:
                    return 12;
            }
        }
    });
    
    var AppView = Mn.View.extend({
        el: "#divApp",
        template: _.noop,
        ui: {
            //txt: ".txtName"  
        },
        events: {
            //"click .btn": "click",
        },
        /*
        regions: {            
            
            cell0: {
                //el: ".cell0",   
                //regionClass: ModalRegion,
                //replaceElement: false,
                //currentView: new mpText({el: "#text1"})
            },
            cell1: {
                //el: ".cell1",   
                //regionClass: ModalRegion,
                //replaceElement: false,
                //currentView: new mpText({el: "#text2"})
            }
        },
        */
        onRender: function() {
            var me = this;
            
            $(".row").each(function(){
                new Row({el: this}).render();    
            });
            
            window.device = me.findDevice($(window).width());
            
            $(window).on("resize", function() {
                window.device = me.findDevice($(this).width());
                
                $(".cell").each(function(){
                   $(this).data("cell").triggerMethod("update:col"); 
                });
                
                console.log(window.device);
            });
            
            window.menu = new Menu().render();
            
            //this.getRegion("cell0").options.currentView = new mpText({el: "#text1"});
            //this.getRegion("cell1").options.currentView = new mpText({el: "#text2"});
            //this.cell0.attachView(new mpText({el: "#text1"}));
            //this.showChildView("cell0", new mpText({el: "#text1"}));
            //this.showChildView("cell1", new mpText({el: "#text2"}));
        },
        onDestroy: function() {
        },      
        findDevice(iWidth) {
            if (iWidth < 576) {   
                return "";
            }
            else if (iWidth < 768) {
                return "sm";
            }
            else if (iWidth < 992) {
                return "md";
            }
            else if (iWidth < 1200) {
                return "lg";
            }
            else {
                return "xl";
            }
        }
    });
    
    var app = new AppView().render();
    /*
    app.addRegion("cell0", ".cell0");
    app.getRegion("cell0").show( new mpText({el: "#text1"}) );
    app.addRegion("cell1", ".cell1");
    app.getRegion("cell1").show( new mpText({el: "#text2"}) );
    */    
});
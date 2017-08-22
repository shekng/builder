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
      jquery: 'libs/jquery-2.0.3.min',
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
            //this.getRegion("cell0").options.currentView = new mpText({el: "#text1"});
            //this.getRegion("cell1").options.currentView = new mpText({el: "#text2"});
            //this.cell0.attachView(new mpText({el: "#text1"}));
            //this.showChildView("cell0", new mpText({el: "#text1"}));
            //this.showChildView("cell1", new mpText({el: "#text2"}));
        },
        onDestroy: function() {
        },      
    });
    
    var app = new AppView().render();
    app.addRegion("cell0", ".cell0");
    app.getRegion("cell0").show( new mpText({el: "#text1"}) );
    app.addRegion("cell1", ".cell1");
    app.getRegion("cell1").show( new mpText({el: "#text2"}) );
    
});
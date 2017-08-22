'use strict';

define(['jquery', 'underscore', 'backbone', 'marionette', 'text!tmpl/mainBlockView.html'],
function($, _, Bb, Mn, templateHTML) {
    
    var textView = Mn.View.extend({        
        template: false,
        ui: {
            title: ".js_title"
        },
        events: {
            "click @ui.title": "clickMe"
        },
        regions: {
        },
        onRender: function() {       
            debugger
        },
        onDestroy: function() {
        },
        clickMe: function() {
            alert("click Me! - " + this.ui.title.text());
        }
    });
        
    return textView;
});


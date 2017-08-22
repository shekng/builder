'use strict';

define(['jquery', 'underscore', 'backbone', 'marionette', 'text!tmpl/mainBlockView.html'],
function($, _, Bb, Mn, templateHTML) {
    
    // Cat Main View
    var CatMainView = Mn.View.extend({
        template: _.template(templateHTML),
        ui: {
        },
        events: {
        },
        regions: {
        },
        onRender: function() {       
        },
        onDestroy: function() {
        }
    });
    
    
        
    return CatMainView;
});


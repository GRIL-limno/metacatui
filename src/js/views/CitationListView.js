/*global define */
define(['jquery', 'underscore', 'backbone', 'collections/Citations', 'views/CitationView'],
    function($, _, Backbone, Citations, CitationView) {
    'use strict';

    var CitationListView = Backbone.View.extend({

        id: 'table',
        className: 'table',
        citationsCollection: null,

        events: {

        },

        initialize: function(options) {
            if((typeof options == "undefined")){
                var options = {};
            }

            // Initializing the Citation collection
            this.citationsCollection = options.citations;
        },


        // retrun the DOM object to the calling view.
        render: function() {
            this.renderView();
            return this;
        },


        // The renderView funciton creates a Citation table and appends every
        // citation found in the citations collection object.
        renderView: function() {
            var self = this;

            if ($.isEmptyObject(this.citationsCollection.get("models"))) {
                var $emptyList = $(document.createElement("div"))
                                            .addClass("empty-citation-list");
                                            
                var $emptyDataElement = $(document.createElement("p"))
                                            .text("No data to display yet.")
                                            .addClass("empty-citation-list-text");
                
                $emptyList.append($emptyDataElement);
                this.$el.append($emptyList);
            }
            else {
                
                var $table = $(document.createElement("table"))
                                            .addClass("metric-table table table-striped table-condensed");
                                            
                var $tableBody = $(document.createElement("tbody"));
                
                this.citationsCollection.each(
                    function(model) {
                        var citationView = new CitationView({model:model});
                        citationView.createLink = true;
                        var $tableRow = $(document.createElement("tr"));
                        var $tableCell = $(document.createElement("td"));
                        $tableCell.append(citationView.render().$el);
                        $tableRow.append($tableCell);
                        $tableBody.append($tableRow);
                    }
                );
                
                $table.append($tableBody);
                this.$el.append($table);
            }
            
        }
    });
     
     return CitationListView;
  });
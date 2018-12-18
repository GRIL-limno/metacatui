/*global define */
define(['jquery', 'underscore', 'backbone',
        'models/filters/FilterGroup',
        'views/filters/FilterView',
        'views/filters/BooleanFilterView',
        'views/filters/ChoiceFilterView',
        'views/filters/DateFilterView',
        'views/filters/NumericFilterView',
        'views/filters/ToggleFilterView',
        'text!templates/filters/filterGroup.html'],
  function($, _, Backbone, FilterGroup, FilterView, BooleanFilterView, ChoiceFilterView,
    DateFilterView, NumericFilterView, ToggleFilterView, Template) {
  'use strict';

  // Renders a display of a group of filters
  var FilterGroupView = Backbone.View.extend({

    // @type {FilterGroup} - A FilterGroup model to be rendered in this view
    model: null,

    subviews: new Array(),

    tagName: "div",

    className: "filter-group tab-pane",

    template: _.template(Template),

    initialize: function (options) {

      if( !options || typeof options != "object" ){
        var options = {};
      }

      this.model = options.model || new FilterGroup();

      this.subviews = new Array();

    },

    render: function () {

      //Add the id attribute from the filter group label
      this.$el.attr("id", this.model.get("label").replace( /([^a-zA-Z0-9])/g, "") );

      //Get the collection of filters
      var filters = this.model.get("filters");

      //Create a new row for the filter views
      var newRowNum = 3, //Start a new row every 3 filter views
          row = $(document.createElement("div")).addClass("row-fluid");
      this.$el.append(row);

      //Render each filter model in the FilterGroup model
      filters.each(function(filter, i){

        //Depending on the filter type, create a filter view
        switch( filter.type ){
          case "Filter":
            var filterView = new FilterView({ model: filter });
            break;
          case "BooleanFilter":
            var filterView = new BooleanFilterView({ model: filter });
            break;
          case "ChoiceFilter":
            var filterView = new ChoiceFilterView({ model: filter });
            break;
          case "DateFilter":
            var filterView = new DateFilterView({ model: filter });
            break;
          case "NumericFilter":
            var filterView = new NumericFilterView({ model: filter });
            break;
          case "ToggleFilter":
            var filterView = new ToggleFilterView({ model: filter });
            break;
          default:
            var filterView = new FilterView({ model: filter });
        }

        //Render the view and append it's element to this view
        filterView.render();

        //Create a new row or append the filter view element to the current row
        if( i < newRowNum ){
          row.append(filterView.el);
        }
        else{
          //Create a new row
          row = $(document.createElement("div")).addClass("row-fluid");
          this.$el.append(row);
          row.append(filterView.el);
          //Uptick the next row counter
          newRowNum += 3;
        }

        //Add the span3 class so the filter views are shown in columns of three
        filterView.$el.addClass("span3");

        //Save a reference to this subview
        this.subviews.push(filterView);

      }, this);

    },

    /*
    * Actions to perform after the render() function has completed and this view's
    * element is added to the webpage.
    */
    postRender: function(){

      //Iterate over each subview and call postRender() if it exists
      _.each( this.subviews, function(subview){

        if( subview.postRender ){
          subview.postRender();
        }

      });

    }

  });
  return FilterGroupView;
});

/*global define */
define(['jquery', 'underscore', 'backbone', 'd3', 'DonutChart', 'views/CitationView', 'text!templates/mdqRun.html', 'text!templates/mdqSuites.html', 'text!templates/loading.html', 'collections/QualityReport'],
	function($, _, Backbone, d3, DonutChart, CitationView, MdqRunTemplate, SuitesTemplate, LoadingTemplate, QualityReport) {
	'use strict';

	// Build the Footer view of the application
	var MdqRunView = Backbone.View.extend({

		el: '#Content',

		events: {
			//"click input[type='submit']"	:	"submitForm"
			//"change #suiteId" : "switchSuite"
		},

		url: null,
		pid: null,
		suiteId: null,
		loadingTemplate: _.template(LoadingTemplate),
		template: _.template(MdqRunTemplate),
        breadcrumbContainer: "#breadcrumb-container",

		initialize: function () {

		},

		render: function () {
			// use the default suite id 
            if (!this.suiteId) {
                this.suiteId = MetacatUI.appModel.get("mdqSuiteId");
            }
            
			//this.url = this.mdqRunsServiceUrl + "/" + this.suiteId + "/" + this.pid;
			var viewRef = this;
            
			if (this.pid) {
              // Fetch a quality report from the quality server and display it.
              var viewRef = this;
              var qualityUrl = MetacatUI.appModel.get("mdqRunsServiceUrl") + viewRef.suiteId + "/" + viewRef.pid;
              var qualityReport = new QualityReport([], {url:qualityUrl, pid: viewRef.pid});
              qualityReport.fetch({url:qualityUrl});
                
              this.listenToOnce(qualityReport, "fetchError", function() {
                // Inspect the results to see if a quality report was returned.
                // If not, then submit a request to the quality engine to create the
                // quality report for this pid/suiteId, and inform the user of this.

                viewRef.hideLoading();
                this.$el.html(this.template({}));
                var msgText;
                if(qualityReport.fetchResponse.status == 404) {
                  msgText = "Error retrieving the quality report for this dataset: Not found";
                } else {
                  msgText = "Error retrieving the quality report for this dataset: " + qualityReport.fetchResponse.status 
                            + qualityReport.fetchResponse.statusText;
                }
                var message = $(document.createElement("div")).append($(document.createElement("span")).text(msgText));
                MetacatUI.uiRouter.navigate("view/" + qualityReport.id, { trigger: true, replace: true });
                MetacatUI.appView.showAlert(message, "alert-success", MetacatUI.appView.currentView.$("alert-container"), 10000, { remove: true });
              }),

              this.listenToOnce(qualityReport, "fetchComplete", function() {
                this.showLoading();
                var groupedResults = qualityReport.groupResults(qualityReport.models);
                var groupedByType = qualityReport.groupByType(qualityReport.models);
                var data = {
                      objectIdentifier: qualityReport.id,
                      suiteId: qualityReport.suiteId,
                      groupedResults: groupedResults,
                      groupedByType: groupedByType,
                      timestamp: _.now(),
                      id: viewRef.pid,
                      checkCount: qualityReport.length
                };

                viewRef.$el.html(viewRef.template(data));
                viewRef.insertBreadcrumbs();
                viewRef.drawScoreChart(qualityReport.models, groupedResults);
                viewRef.showCitation();
                viewRef.show();
                viewRef.$('.popover-this').popover();
              });
			} else {
				this.$el.html(this.template({}));
                viewRef.insertBreadcrumbs();
			}
		},

		showLoading: function() {
			this.$el.html(this.loadingTemplate({ msg: "Retreiving quality report..."}));
		},
        
        hideLoading: function() {
            if(this.$loading)  this.$loading.remove();
            if(this.$detached) this.$el.html(this.$detached);
        },

		showCitation: function(){
			if(!this.citationView) return false;

			this.$("#mdqCitation").prepend(this.citationView.el);
		},

		show: function() {
			var view = this;
			this.$el.hide();
			this.$el.fadeIn({duration: "slow"});
		},

		drawScoreChart: function(results, groupedResults){

			var dataCount = results.length;
			var data = [
			            {label: "Pass", count: groupedResults.GREEN.length, perc: groupedResults.GREEN.length/results.length },
			            {label: "Warn", count:  groupedResults.ORANGE.length, perc: groupedResults.ORANGE.length/results.length},
			            {label: "Fail", count: groupedResults.RED.length, perc: groupedResults.RED.length/results.length},
			            {label: "Info", count: groupedResults.BLUE.length, perc: groupedResults.BLUE.length/results.length},
			        ];
                    
			var svgClass = "data";

			//If d3 isn't supported in this browser or didn't load correctly, insert a text title instead
			if(!d3){
				this.$('.format-charts-data').html("<h2 class='" + svgClass + " fallback'>" + MetacatUI.appView.commaSeparateNumber(dataCount) + " data files</h2>");

				return;
			}

			//Draw a donut chart
			var donut = new DonutChart({
							id: "data-chart",
							data: data,
							total: dataCount,
							titleText: "checks",
							titleCount: dataCount,
							svgClass: svgClass,
							countClass: "data",
							height: 250,
							width: 250,
							keepOrder: true,
							formatLabel: function(name) {
								return name;
							}
						});
			this.$('.format-charts-data').html(donut.render().el);
		},
        
    	insertBreadcrumbs: function(){
    		var breadcrumbs = $(document.createElement("ol"))
    					      .addClass("breadcrumb")
    					      .append($(document.createElement("li"))
    					    		  .addClass("home")
    					    		  .append($(document.createElement("a"))
    					    				  .attr("href", MetacatUI.root)
    					    				  .addClass("home")
    					    				  .text("Home")))
    	    				  .append($(document.createElement("li"))
    	    						  .addClass("search")
    					    		  .append($(document.createElement("a"))
    					    				  .attr("href", MetacatUI.root + "/data" + ((MetacatUI.appModel.get("page") > 0)? ("/page/" + (parseInt(MetacatUI.appModel.get("page"))+1)) : ""))
    					    				  .addClass("search")
    					    				  .text("Search")))
    	    				  .append($(document.createElement("li"))
    					                      .append($(document.createElement("a"))
    					    				  .attr("href", MetacatUI.root + "/view/" + this.pid)
    					    				  .addClass("inactive")
    					    				  .text("Metadata")))
                              .append($(document.createElement("li"))
                                    .append($(document.createElement("a"))
                                    .attr("href", MetacatUI.root + "/quality/" + this.pid)
                                    .addClass("inactive")
                                    .text("Quality Report")));
                                    
    		this.$(this.breadcrumbContainer).html(breadcrumbs);
    	},
	});
	return MdqRunView;
});

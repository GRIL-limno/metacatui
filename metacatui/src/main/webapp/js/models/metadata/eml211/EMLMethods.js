/* global define */
define(['jquery', 'underscore', 'backbone', 'models/DataONEObject'], 
    function($, _, Backbone, DataONEObject) {

	var EMLMethods = Backbone.Model.extend({
		
		defaults: {
			objectXML: null,
			objectDOM: null,
		},
		
		initialize: function(attributes){
			if(attributes.objectDOM) this.parse(attributes.objectDOM);

			//specific attributes to listen to
			this.on("change:methodStep" +
					this.trickleUpChange);
		},
		
		/*
         * Maps the lower-case EML node names (valid in HTML DOM) to the camel-cased EML node names (valid in EML). 
         * Used during parse() and serialize()
         */
        nodeNameMap: function(){
        	return {
        		"methodstep" : "methodStep",
				"substep" : "subStep",
				"datasource" : "dataSource",
				"studyextent" : "studyExtent",
				"samplingdescription" : "samplingDescription",
				"spatialsamplingunits" : "spatialSamplingUnits",
				"referencedentityid" : "referencedEntityId",
				"qualitycontrol" : "qualityControl"
            }
        },

		parse: function(objectDOM) {
			var modelJSON = {};

			if (!objectDOM) var objectDOM = this.get("objectDOM");
			
			return modelJSON;
		},
		
		serialize: function(){
			var objectDOM = this.updateDOM(),
				xmlString = objectDOM.outerHTML;
			
			//Camel-case the XML
	    	xmlString = this.formatXML(xmlString);
        	
        	return xmlString;
		},
		
		/*
		 * Makes a copy of the original XML DOM and updates it with the new values from the model.
		 */
		updateDOM: function(){
			var objectDOM;

			if (this.get("objectDOM")) {
				objectDOM = this.get("objectDOM").cloneNode(true);
			} else {
				objectDOM = $("<methods></methods>");
			}
			 
			// Remove empty (zero-length or whitespace-only) nodes
			$(objectDOM).find("*").filter(function() { return $.trim(this.innerHTML) === ""; } ).remove();
			
			 return objectDOM;
		},
		
		trickleUpChange: function(){
			MetacatUI.rootDataPackage.packageModel.set("changed", true);
		},
		
		formatXML: function(xmlString){
			return DataONEObject.prototype.formatXML.call(this, xmlString);
		}
	});
	
	return EMLMethods;
});
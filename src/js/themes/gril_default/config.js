MetacatUI.theme = MetacatUI.theme || "gril";
MetacatUI.themeTitle = "metaGRIL Data Catalog";
MetacatUI.themeMap = 
{
        '*': {
                // example overrides are provided here
                'templates/navbar.html' : 'themes/gril/templates/navbar.html',
                'templates/footer.html' : 'themes/gril/templates/footer.html',
                'templates/mainContent.html' : 'themes/gril/templates/mainContent.html',
                'templates/loginButtons.html' : 'themes/gril/templates/loginButtons.html',

		'templates/dataPackageStart.html' : 'themes/gril/templates/dataPackageStart.html',

                /*
		'templates/dataItem.html' : 'themes/gril/templates/dataItem.html',
                'templates/dataPackage.html' : 'themes/gril/templates/dataPackage.html',
		*/

                'templates/metadata/metadataOverview.html' : 'themes/gril/templates/metadata/metadataOverview.html',
                'templates/metadata/eml-people.html' : 'themes/gril/templates/metadata/eml-people.html',
                'templates/metadata/dates.html' : 'themes/gril/templates/metadata/dates.html',
                'templates/metadata/locationsSection.html' : 'themes/gril/templates/metadata/locationsSection.html',
                'templates/metadata/taxonomicCoverage.html' : 'themes/gril/templates/metadata/taxonomicCoverage.html',
                'templates/metadata/EMLMethods.html' : 'themes/gril/templates/metadata/EMLMethods.html'
                }
};

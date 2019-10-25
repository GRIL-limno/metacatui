MetacatUI.theme = MetacatUI.theme || "gril_default";
MetacatUI.themeTitle = "metaGRIL Data Catalog";
MetacatUI.themeMap = 
{
        '*': {
                // example overrides are provided here
                'templates/navbar.html' : 'themes/gril_default/templates/navbar.html',
                'templates/footer.html' : 'themes/gril_default/templates/footer.html',
                'templates/mainContent.html' : 'themes/gril_default/templates/mainContent.html',
                'templates/loginButtons.html' : 'themes/gril_default/templates/loginButtons.html',

		'templates/dataPackageStart.html' : 'themes/gril_default/templates/dataPackageStart.html',

                /*
		'templates/dataItem.html' : 'themes/gril_default/templates/dataItem.html',
                'templates/dataPackage.html' : 'themes/gril_default/templates/dataPackage.html',
		*/

                'templates/metadata/metadataOverview.html' : 'themes/gril_default/templates/metadata/metadataOverview.html',
                'templates/metadata/eml-people.html' : 'themes/gril_default/templates/metadata/eml-people.html',
                'templates/metadata/dates.html' : 'themes/gril_default/templates/metadata/dates.html',
                'templates/metadata/locationsSection.html' : 'themes/gril_default/templates/metadata/locationsSection.html',
                'templates/metadata/taxonomicCoverage.html' : 'themes/gril_default/templates/metadata/taxonomicCoverage.html',
                'templates/metadata/EMLMethods.html' : 'themes/gril_default/templates/metadata/EMLMethods.html'
                }
};

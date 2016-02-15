angular.module('d3-templates', [])
	.service('d3Service', [
	    '$window',
	    function($window) {
	        return $window.d3;
	    }
	])
	.directive('d3Template', [
		'd3Service',
		function(d3Service) {
			return {
				scope: {
					templates: '='
				},
				link: function(scope, element, attrs) {
					var TEMPLATE_SUPPORTED_ACTIONS = ['attr', 'text', 'html', 'classed', 'style', 'property', 'remove'],
						selection = d3Service.select(element[0]);

					function processTemplateActions(actionTemplate, selection) {
						_(actionTemplate)
							.pick(TEMPLATE_SUPPORTED_ACTIONS)
							.forIn(function(templateActionParams, templateAction) {
								selection = selection[templateAction](templateActionParams);
							}, this);

						return selection
					}

					function processDataBoundTemplate(template, parentEnterSelection, parentUpdateSelection) {
						var dataEnterSelection, dataUpdateSelection;

						if (!template.tag) {
							throw Error('tag must be specified for all elements');
						}

						if (!template.selector) {
							throw Error('selector needs to be specified for data bound child');
						}

						dataEnterSelection = parentEnterSelection.append(template.tag);
						if (template.enterActions) {
							dataEnterSelection = processTemplateActions(template.enterActions, dataEnterSelection);
						}

						dataUpdateSelection = parentUpdateSelection.selectAll(template.selector);
						if(template.updateActions) {
							dataUpdateSelection = processTemplateActions(template.updateActions, dataUpdateSelection);
						}

						if (template.children) {
							_.forEach(template.children, function(childTemplate) {
								processDataBoundTemplate(childTemplate, dataEnterSelection, dataUpdateSelection);
							}, this);
						}

						if (template.dataBoundChildren) {
							processDataBoundChildTemplates(template.dataBoundChildren, dataEnterSelection);
						}
					}

					function processDataBoundChildTemplates(dataBoundChildTemplates, selection) {
						var dataEnterSelection,
							dataUpdateSelection;

						_.forEach(dataBoundChildTemplates, function(dataBoundChildTemplate) {
							if (!dataBoundChildTemplate.selector) {
								throw Error('selector needs to be specified for data bound child');
							}

							if (!dataBoundChildTemplate.data) {
								throw Error('data needs to be specified for data bound child');
							}

							dataUpdateSelection = selection.selectAll(dataBoundChildTemplate.selector)
								.data(dataBoundChildTemplate.data, dataBoundChildTemplate.dataKeyFn);
							dataEnterSelection = dataUpdateSelection.enter();

							processDataBoundTemplate(dataBoundChildTemplate, dataEnterSelection, dataUpdateSelection);

							if (dataBoundChildTemplate.exitActions) {
								processTemplateActions(dataBoundChildTemplate.exitActions, dataUpdateSelection.exit());
							}
						}, this);
					}

					// function processDataBoundTemplate(template, parentSelection) {
					// 	if (!dataBoundChildTemplate.selector) {
					// 		throw Error('a data bound template element needs a selector');
					// 	}
					// }

					// function processStaticTemplate(template, parentSelection) {
						
					// }

					function processTemplates(templates, parentSelection) {
						if (_.isUndefined(parentSelection)) {
							return;
						}

						_.forEach(templates, function(template) {
							var currentSelection;

							if (!template.tag) {
								throw Error('tag must be specified for each element');
							}

							currentSelection = parentSelection.append(template.tag);
							if (template.actions) {
								currentSelection = processTemplateActions(template.actions, currentSelection);
							}

							if (template.children) {
								processTemplates(template.children, currentSelection);
							}

							if (template.dataBoundChildren) {
								processDataBoundChildTemplates(template.dataBoundChildren, currentSelection);
							}
						}, this);
					}

					processTemplates(scope.templates, selection);	
				}
			};
		}
	]);
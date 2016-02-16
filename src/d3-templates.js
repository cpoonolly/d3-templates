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
					templates: '=',
					templateChange: '='
				},
				link: function(scope, element, attrs) {
					var TEMPLATE_SUPPORTED_ACTIONS = ['attr', 'text', 'html', 'classed', 'style', 'property', 'remove'],
						selection = d3Service.select(element[0]),
						processStaticIteration = true;

					function processTemplateActions(actionTemplate, selection) {
						_(actionTemplate)
							.pick(TEMPLATE_SUPPORTED_ACTIONS)
							.forIn(function(templateActionParams, templateAction) {
								selection = selection[templateAction](templateActionParams);
							}, this);

						return selection
					}

					function processTemplates(templates, parentEnterSelection, parentUpdateSelection, isDataBound) {
						if (_.isUndefined(parentEnterSelection)) {
							throw Error('no parent selection specified');
						}

						if (_.isUndefined(isDataBound)) {
							isDataBound = false;
						}

						_.forEach(templates, function(template) {
							var staticSelection,
								enterSelection,
								updateSelection;

							if (!template.tag) {
								throw Error('tag must be specified for each element');
							}

							if (template.data) {
								if (!template.selector) {
									throw Error('selector needs to be specified for data bound child');
								}

								updateSelection = parentEnterSelection.selectAll(template.selector)
									.data(template.data, template.dataKeyFn);
								enterSelection = updateSelection.enter()
									.append(template.tag);

								if (template.enterActions) {
									enterSelection = processTemplateActions(template.enterActions, enterSelection);
								}

								isDataBound = true;
							} else if (!isDataBound && !processStaticIteration) {
								if (template.children) {
									processTemplates(template.children, parentEnterSelection.selectAll(template.selector));
								}

								return;
							} else {
								enterSelection = parentEnterSelection.append(template.tag);

								if (template.enterActions) {
									enterSelection = processTemplateActions(template.enterActions, enterSelection);
								}

								if (isDataBound) {
									if (!template.selector) {
										throw Error('selector needs to be specified for data bound child');
									}

									updateSelection = parentUpdateSelection.selectAll(template.selector);
								}
							}

							if (updateSelection) {
								if (template.updateActions) {
									updateSelection = processTemplateActions(template.updateActions, updateSelection);
								}

								if (template.exitActions) {
									processTemplateActions(template.exitActions, updateSelection.exit());
								}
							}

							if (template.children) {
								processTemplates(template.children, enterSelection, updateSelection, isDataBound);
							}
						}, this);
					}

					scope.$watch(scope.templateChange, function() {
						processTemplates(scope.templates, selection);						
					});

					processStaticIteration = true;
					processTemplates(scope.templates, selection);
					processStaticIteration = false;
				}
			};
		}
	]);
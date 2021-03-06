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
					templateWatchExpression: '='
				},
				link: function(scope, element, attrs) {
					var TEMPLATE_SUPPORTED_ACTIONS = ['attr', 'text', 'html', 'classed', 'style', 'property', 'remove'],
						selection = d3Service.select(element[0]),
						processStaticIteration,
						uniqueClassMap;

					function processTemplateActions(actionTemplate, selection) {
						_(actionTemplate)
							.pick(TEMPLATE_SUPPORTED_ACTIONS)
							.forIn(function(templateActionParams, templateAction) {
								selection = selection[templateAction](templateActionParams);
							}, this);

						return selection
					}

					function processTemplates(templates, parentEnterSelection, parentUpdateSelection) {
						if (_.isUndefined(parentEnterSelection)) {
							throw Error('no parent selection specified');
						}

						_.forEach(templates, function(template) {
							var enterSelection,
								updateSelection,
								selector,
								templateDefaults;

							if (!template.tag) {
								throw Error('tag must be specified for each element');
							}

							if (!template.class) {
								throw Error('class must be specified for each element');
							} else if (uniqueClassMap[template.class] !== undefined) {
								throw Error('non-unique class entered for element');
							}

							templateDefaults = {
								enterActions: {attr: {class: template.class}},
								updateActions: {},
								exitActions: {}
							};

							selector = template.tag + '.' + template.class;
							template = _.defaultsDeep(template, templateDefaults);

							if (template.data) {
								updateSelection = parentEnterSelection.selectAll(selector)
									.data(template.data, template.dataKeyFn);
								enterSelection = updateSelection.enter()
									.append(template.tag);

								enterSelection = processTemplateActions(template.enterActions, enterSelection);
								updateSelection = processTemplateActions(template.updateActions, updateSelection);
								processTemplateActions(template.exitActions, updateSelection.exit());
							} else if (parentUpdateSelection) {
								enterSelection = parentEnterSelection.append(template.tag);
								enterSelection = processTemplateActions(template.enterActions, enterSelection);

								updateSelection = parentUpdateSelection.selectAll(selector);
								updateSelection = processTemplateActions(template.updateActions, updateSelection);
							} else if (!processStaticIteration) {
								if (template.children) {
									processTemplates(template.children, parentEnterSelection.selectAll(selector));
								}

								return;
							} else {
								enterSelection = parentEnterSelection.append(template.tag);
								enterSelection = processTemplateActions(template.enterActions, enterSelection);
							}

							if (template.children) {
								processTemplates(template.children, enterSelection, updateSelection);
							}
						}, this);
					}

					scope.$watch(scope.templateWatchExpression, function() {
						console.log('watch registered a change reprocessing...');

						uniqueClassMap = {};
						processStaticIteration = false;
						processTemplates(scope.templates, selection);						
					});

					uniqueClassMap = {};
					processStaticIteration = true;
					processTemplates(scope.templates, selection);
				}
			};
		}
	]);
angular.module('test1', ['d3-templates'])
	.controller('test1Controller', [
		'$scope',
		function($scope) {
			var BAR_MAX_HEIGHT = 500,
				BAR_WIDTH = 50,
				BAR_COUNT = 10;

			$scope.test1Message = "hello world!";

			$scope.test1D3Data = _.times(BAR_COUNT, function(index) {
				return {
					name: 'some data - ' + index,
					val: Math.floor(Math.random() * BAR_MAX_HEIGHT)
				};
			});

			$scope.test1D3DataKeyFn = function(datum) {
				return datum.name;
			};

			$scope.test1D3BarTransform = function(datum, index) {
				return 'translate(' + (index * BAR_WIDTH) + ',' + (BAR_MAX_HEIGHT - datum.val) +')';
			};

			$scope.test1D3BarHeight = function(datum) {
				return datum.val + 'px';
			};

			$scope.updateTest1Data = function() {
				_.forEach($scope.test1D3Data, function(datum) {
					datum.val = Math.floor(Math.random() * BAR_WIDTH);
				});
			};

			$scope.test1D3Template = [{
				tag: 'svg',
				enterActions: {
					attr: {
						width: (BAR_COUNT * BAR_WIDTH),
						height: BAR_MAX_HEIGHT
					}
				},
				children: [
					{
						tag: 'text',
						enterActions: {
							attr: {
								class: 'test1-title'
							},
							text: 'Test 1 Data!'	
						}
					},
					{
						tag: 'g',
						enterActions: {
							attr: {
								class: 'test1-wrapper'
							}
						},
						children: [{
							tag: 'g',
							data: $scope.test1D3Data,
							dataKeyFn: $scope.test1D3DataKeyFn,
							selector: 'g.test1-data-wrap',
							enterActions: {
								attr: {
									class: 'test1-data-wrap',
									transform: $scope.test1D3BarTransform
								}
							},
							exitActions: {
								remove: undefined
							},
							children: [
								{
									tag: 'rect',
									selector: 'rect.test1-data-bar',
									enterActions: {
										attr: {
											class: 'test1-data-bar',
											width: BAR_WIDTH,
											y: 0,
											x: 0
										},
										style: {fill: 'red'}
									},
									updateActions: {
										attr: {
											height: $scope.test1D3BarHeight
										}
									}
								}
							]
						}]
					}
				]
			}];
		}
	]);

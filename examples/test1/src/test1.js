angular.module('test1', ['d3-templates'])
	.controller('test1Controller', [
		'$scope',
		function($scope) {
			$scope.test1Message = "hello world!";

			$scope.test1D3Data = _.times(5, function(index) {
				return {
					name: 'some data - ' + index,
					val: Math.floor(Math.random() * 10)
				};
			});

			$scope.test1D3DataKeyFn = function(datum) {
				return datum.name;
			};

			$scope.test1D3BarTransform = function(datum, index) {
				return 'translate(' + (index * 10) + ',0)';
			};

			$scope.test1D3BarHeight = function(datum) {
				return datum.val;
			};

			$scope.updateTest1Data = function() {
				_.forEach($scope.test1D3Data, function(datum) {
					datum.val = Math.floor(Math.random() * 10);
				});
			};

			$scope.test1D3Template = [{
				tag: 'svg',
				children: [
					{
						tag: 'text',
						actions: {
							attr: {
								class: 'test1-title'
							},
							text: 'Test 1 Data!'	
						}
					},
					{
						tag: 'g',
						actions: {
							attr: {
								class: 'test1-wrapper',
								transform: 'scale(1,-1)'
							}
						},
						dataBoundChildren: [{
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
											width: 10,
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

'use strict';

angular.module("BookApp").config(['$routeProvider',
	function($routeProvider) {
		$routeProvider
		.when('/home', {
			templateUrl: 'templates/library.html',
			controller: 'LibraryCtrl'
		})
		.when('/search', {
			templateUrl: 'templates/search.html',
			controller: 'SearchCtrl'
		})
		.otherwise({
			redirectTo: '/home'
		});
	}
]);
angular.module("BookApp").run(function($rootScope, $location, $timeout) {
	$rootScope.$on('$viewContentLoaded', function() {
		$timeout(function() {
			componentHandler.upgradeAllRegistered();
		});
	});
});

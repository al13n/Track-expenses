(function(){
	'use strict';
	
	var app = angular.module('track-expenses');

	app.config(function($stateProvider, $urlRouterProvider, localStorageServiceProvider) {
  		$urlRouterProvider.otherwise("/");
      localStorageServiceProvider.setPrefix('ls');

 		$stateProvider
    		.state('home', {
      		url: "/",
      		controller: "HomeCtrl",
      		templateUrl: "app/html/home.html"
    		})
    		.state('home.signup', {
    			url: "signup",
    			templateUrl: "app/html/signup.html", 
          controller: "SignupCtrl",
          controllerAs: "signup"
    		})
        .state('home.expenses', {
          url: "expenses",
          templateUrl: "app/html/manageExpenses.html",
          controller: "ManageExpensesCtrl",
          controllerAs: "manageExpenses"
        });
		});
})();


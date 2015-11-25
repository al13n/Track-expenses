(function(){
	'use strict';
	function HeaderCtrl($uibModal, $state, userDataService){
		var header = this;
		header.login = login;
		header.signup = signup;
		header.isAuthenticated = isAuthenticated;
		header.logout = logout;
		header.getUsername = getUsername;


		function login(){
			var modalInstance = $uibModal.open({
				animation: true,
      			templateUrl: 'app/html/loginModal.html',
      			controller: 'LoginModalCtrl',
      			size: 'sm'
      			});
		}

		function isAuthenticated(){
			return userDataService.isAuthenticated;
		}

		function getUsername(){
			return userDataService.username;
		}

		function signup(){
			$state.go('home.signup');
		}

		function logout(){
			userDataService.removeToken();
			userDataService.resetData();
			$state.go('home');
		}
	}


	var app = angular.module('track-expenses');
	
	app.controller('HeaderCtrl', ['$uibModal', '$state' , 'userDataService', HeaderCtrl]);

	app.directive('header', function() {
  		return {
    		restrict: 'A',
    		templateUrl: 'app/html/header.html',
    		controller: 'HeaderCtrl',
    		controllerAs: 'header'
  		};
	});

})();
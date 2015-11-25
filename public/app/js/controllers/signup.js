(function(){
	
	function SignupCtrl($scope, $state, apiService, userDataService){
		var signup = this;
		signup.submit = submit;
		signup.cancel = cancel;


		function submit(){
			apiService.signup(signup.user.username, signup.user.email, signup.user.password)
			.then(function(data){
				if(data.success){
					userDataService.saveToken(data.token);
    				userDataService.init();
				}
				
			});
		}
		

		function cancel(){
			$state.go('home');
		}
	}

	var app = angular.module('track-expenses');
	app.controller('SignupCtrl', ['$scope', '$state', 'apiService', 'userDataService', SignupCtrl]);

})();
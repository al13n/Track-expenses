(function(){
	angular.module('track-expenses').controller('LoginModalCtrl', function ($scope, $uibModalInstance, $state, apiService, userDataService) {


  		$scope.login = function () {
        apiService.login($scope.user.name, $scope.user.password)
        .then(function(res){
          if(res.success){
            $uibModalInstance.close();
            userDataService.saveToken(res.token);
            userDataService.init();
          }
          else{
              $scope.loginform.username.$setValidity("username", false);
              $scope.loginform.password.$setValidity("password", false);
          }
        });
    		
  		};

  		$scope.cancel = function () {
    		$uibModalInstance.dismiss('cancel');
  		};

  		$scope.gotoSignup = function(){
  			$scope.cancel();
  			$state.go('home.signup');
  		};
});
})();
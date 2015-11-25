(function(){
	function UserDataService($q, $state, apiService, localStorageService){
		var userDataService = this;
		userDataService.saveToken = saveToken;
		userDataService.getToken = getToken;
		userDataService.isAuthenticated = false;
		userDataService.username = ""; 
		userDataService.checkToken = checkToken;
		userDataService.removeToken = removeToken;
		userDataService.resetData = resetData;
		userDataService.getUserExpenses = getUserExpenses;
		userDataService.addNewExpense = addNewExpense;
		userDataService.deleteExpense = deleteExpense;
		userDataService.updateExpense = updateExpense;
		userDataService.makeAdminUser = makeAdminUser;
		userDataService.removeAdminUser = removeAdminUser;
		userDataService.getAllUsers = getAllUsers;
		userDataService.deleteUser = deleteUser;
		userDataService.init = init;

		function makeAdminUser(id){
			return apiService.makeAdminUser(getToken(), id);
		}

		function removeAdminUser(id){
			return apiService.removeAdminUser(getToken(), id);
		}

		function getAllUsers(){
			return apiService.getAllUsers(getToken());
		}

		function deleteUser(id){
			return apiService.deleteUser(getToken(), id);
		}

		function updateExpense(id, expense){
			var deferred = $q.defer();

			apiService.updateExpense(getToken(), id, expense)
			.then(function(res){
				deferred.resolve(res.success);
			});

			return deferred.promise;
		}

		function deleteExpense(id){
			var deferred = $q.defer();

			apiService.deleteExpense(getToken(), id)
			.then(function(res){
				deferred.resolve(res.success);
			});

			return deferred.promise;
		}

		function addNewExpense(expense){
			var deferred = $q.defer();

			apiService.postNewExpense(getToken(), expense)
			.then(function(res){
				deferred.resolve(res.success);
			});

			return deferred.promise;
		}


		function saveToken(token){
			localStorageService.set('token', token);
		}

		function getToken(){
			var token = localStorageService.get('token');
			return token;
		}

		function removeToken(){
			return localStorageService.remove('token');
		}

		function checkToken(){
			var token = getToken();
			var deferred = $q.defer();
			if(!token){
				deferred.resolve(false);
			}
			apiService.authenticate(token)
			.then(function(res){
				if(res.success){
					userDataService.isAuthenticated = true;
					userDataService.username = res.username;
					deferred.resolve(true);
				}
				else{
					resetData();
					deferred.resolve(false);
				}
			});
			return deferred.promise;
		}

		function resetData(){
			userDataService.isAuthenticated = false;
			userDataService.username = ""; 
			removeToken();
		}
		
		function getUserExpenses(){
			var deferred = $q.defer();
		    apiService.getUserExpenses(getToken())
		    .then(function(res){
		        if(res.success){
		            userDataService.expensesList = res.expenses;
		            _.forEach(userDataService.expensesList, function(expense){
		        		expense.date = new Date(expense.date);
		        	});
		            deferred.resolve();
		        }
		    });

		    return deferred.promise;
		}
		
		function goToManageExpenses(){
			$state.go('home.expenses');
		}

		function init(){
			checkToken()
			.then(function(isAuthenticated){
			    if(isAuthenticated){
			        goToManageExpenses();
			    }
			});
		}
 
	}

	var app = angular.module('track-expenses');
	app.service('userDataService', ['$q', '$state', 'apiService', 'localStorageService', UserDataService]);
})();
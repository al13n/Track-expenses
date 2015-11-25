(function(){
	'use strict';
	function ApiService($http, $q){
		var apiService = this;
		apiService.signup = signup;
		apiService.login = login;
		apiService.authenticate = authenticate;
		apiService.getUserExpenses = getUserExpenses;
		apiService.postNewExpense = postNewExpense;
		apiService.deleteExpense = deleteExpense;
		apiService.updateExpense = updateExpense;
		apiService.makeAdminUser = makeAdminUser;
		apiService.removeAdminUser = removeAdminUser;
		apiService.getAllUsers = getAllUsers;
		apiService.deleteUser = deleteUser;


		function makeAdminUser(token, id){
			var url = "/users/makeadmin/" + id;
			var configobj = {headers: {'x-access-token': token}};
			return post(url, {}, configobj);
		}

		function removeAdminUser(token, id){
			var url = "/users/removeadmin/" + id;
			var configobj = {headers: {'x-access-token': token}};
			return post(url, {}, configobj);
		}

		function getAllUsers(token){
			var url = "/users";
			var configobj = {headers: {'x-access-token': token}};
			return get(url, configobj);
		}

		function deleteUser(token, id){
			var url = "/users/" + id;
			var configobj = {headers: {'x-access-token': token}};
			var promise = $http.delete(url, configobj);
			var deferred = $q.defer();

			promise.then(function(res){
				deferred.resolve(res.data);
			});
			return deferred.promise;
		}


		function deleteExpense(token, id){
			var url = "/expenses/" + id;
			var configobj = {headers: {'x-access-token': token}};
			var promise = $http.delete(url, configobj);
			var deferred = $q.defer();

			promise.then(function(res){
				deferred.resolve(res.data);
			});
			return deferred.promise;
		}

		function updateExpense(token, id, expense){
			var url = "/expenses/" + id;
			var configobj = {headers: {'x-access-token': token}};
			var promise = $http.put(url, expense, configobj);
			var deferred = $q.defer();

			promise.then(function(res){
				deferred.resolve(res.data);
			});
			return deferred.promise;
		}

		function postNewExpense(token, expense){
			var configobj = {headers: {'x-access-token': token}};
			var promise = $http.post('/expenses', expense, configobj);
			var deferred = $q.defer();

			promise.then(function(res){
				deferred.resolve(res.data);
			});
			return deferred.promise;
		}

		function signup(username, email, password){
			var newuser = {
				username: username,
				email: email,
				password: password
			};

			var promise = $http.post('/signup', newuser);
			var deferred = $q.defer();

			promise.then(function(res){
				deferred.resolve(res.data);
			});
			return deferred.promise;
		}

		function login(username, password){
			var user = {
				username: username, 
				password: password
			};

			var promise = $http.post('/login', user);
			var deferred = $q.defer();

			promise.then(function(res){
				deferred.resolve(res.data);
			});
			return deferred.promise;
		}

		function authenticate(token){
			var tokenobj = {token: token};
			var promise = $http.post('/authenticate', tokenobj);
			var deferred = $q.defer();

			promise.then(function(res){
				deferred.resolve(res.data);
			});
			return deferred.promise;
		}
		
		function getUserExpenses(token){
		    var configobj = {headers: {'x-access-token': token}};
			var promise = $http.get('/expenses', configobj);
			var deferred = $q.defer();

			promise.then(function(res){
				deferred.resolve(res.data);
			});
			return deferred.promise;
		}

		function get(url, configobj){
			var promise = $http.get(url, configobj);
			var deferred = $q.defer();

			promise.then(function(res){
				deferred.resolve(res.data);
			});
			return deferred.promise;
		}

		function post(url, data, configobj){
			var promise = $http.post(url, data, configobj);
			var deferred = $q.defer();

			promise.then(function(res){
				deferred.resolve(res.data);
			});
			return deferred.promise;
		}
	}

	var app = angular.module('track-expenses');
	app.service('apiService', ['$http', '$q', ApiService]);
})();
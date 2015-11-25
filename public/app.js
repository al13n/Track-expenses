(function(){
	'use strict';
	var app = angular.module('track-expenses', ['ui.router', 'ui.bootstrap', 'LocalStorageModule']);
})();
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
(function(){
    'use strict';
    function HomeCtrl(userDataService){
        
        function init(){
            userDataService.init();
        }
        
        init();
    }
    
    var app = angular.module('track-expenses');
    app.controller('HomeCtrl', ['userDataService', HomeCtrl]);
})();
(function(){
	'use strict';
	function ManageExpensesCtrl(userDataService){
		var manageExpenses = this;
		manageExpenses.addNewExpense = addNewExpense;
		manageExpenses.updateExpense = updateExpense;
		manageExpenses.deleteExpense = deleteExpense;
		manageExpenses.getExpenses = getExpenses;
		manageExpenses.moveToUpdate = moveToUpdate;
		manageExpenses.isNotEmptyList = isNotEmptyList;
		manageExpenses.showAdd = showAdd;
		manageExpenses.cancel = cancel;
		manageExpenses.isTabValue = isTabValue;
		manageExpenses.setTabValue = setTabValue;
		manageExpenses.makeAdminUser = makeAdminUser;
		manageExpenses.removeAdminUser = removeAdminUser;
		manageExpenses.getAllUsers = getAllUsers;
		manageExpenses.deleteUser = deleteUser;
		manageExpenses.isTableShown = isTableShown;

		var tabValue;

		function isTableShown(){
			return (tabValue == 1 && isNotEmptyList());
		}

		function makeAdminUser(id){
			userDataService.makeAdminUser(id)
			.then(function(res){
					getAllUsers();
			});
		}

		function removeAdminUser(id){
			userDataService.removeAdminUser(id)
			.then(function(res){
					getAllUsers();
			});
		}

		function getAllUsers(){
			userDataService.getAllUsers()
			.then(function(res){
				if(res.success){
					manageExpenses.usersList = res.users;
				}
				else{
					manageExpenses.usersList = [];
				}
			});
		}

		function deleteUser(id){
			userDataService.deleteUser(id)
			.then(function(res){
					getAllUsers();
			});
		}

		function setTabValue(id){
			tabValue = id;
			if(tabValue === 2){
				getAllUsers();
			}
		}

		function isTabValue(id){
			return (id == tabValue);
		}

		function getAnalytics(){
			manageExpenses.totalExpenses = 0;
			_.forEach(manageExpenses.expensesList, function(expense){
				manageExpenses.totalExpenses += expense.amount;
			});
			manageExpenses.expensesList.sort(function(a, b) {
    			var aa = a.date,
        		bb = b.date;

    			if (aa !== bb) {
        			if (aa > bb) { return 1; }
        			if (aa < bb) { return -1; }
    			}
    			return 0;
			});

			/* SOURCE: http://stackoverflow.com/questions/6117814/get-week-of-year-in-javascript-like-in-php */
			Date.prototype.getWeekNumber = function(){
    			var d = new Date(+this);
    			d.setHours(0,0,0);
    			d.setDate(d.getDate()+4-(d.getDay()||7));
    			return Math.ceil((((d-new Date(d.getFullYear(),0,1))/8.64e7)+1)/7);
			};

			/* x.getFullYear() */

			/* #region AVERAGE_DAY_SPENDING */
			var prevDate = new Date(0);
			var dailyExpensesList = [0];
			

			function isSameDay(date1, date2){
				return(date1.getDate() == date2.getDate() && date1.getMonth() == date2.getMonth() && date1.getFullYear() == date2.getFullYear());
			}

			_.forEach(manageExpenses.expensesList, function(expense){
				if(!isSameDay(expense.date,prevDate)){
					dailyExpensesList.push(expense.amount);
				}
				else{
					dailyExpensesList[dailyExpensesList.length-1] += expense.amount;
				}
				prevDate = expense.date;
			});


			var len = dailyExpensesList.length;
			if(dailyExpensesList[0] === 0) len--;
			if(len <= 0){
				manageExpenses.averageDaySpending  = 0;
			}
			else{
				manageExpenses.averageDaySpending = (manageExpenses.totalExpenses*1.0)/len;
			}

			/* #endRegion */


			/*#region Average weekly spend */

			prevDate = new Date(0);
			var weeklyExpenseList = [0];

			_.forEach(manageExpenses.expensesList, function(expense){
				if(expense.date.getWeekNumber() == prevDate.getWeekNumber() && expense.date.getFullYear() == prevDate.getFullYear()){
					weeklyExpenseList[weeklyExpenseList.length - 1] += expense.amount;
				}
				else{
					weeklyExpenseList.push(expense.amount); 
				}
				prevDate = expense.date;
			});
			console.log(weeklyExpenseList);
			len = weeklyExpenseList.length;
			if(weeklyExpenseList[0] === 0) len--;
			if(len <= 0){
				manageExpenses.averageWeeklySpending  = 0;
			}
			else{
				manageExpenses.averageWeeklySpending = (manageExpenses.totalExpenses*1.0)/len;
			}

			var nowDate = new Date();
			if(prevDate.getFullYear() == nowDate.getFullYear() && prevDate.getWeekNumber() == nowDate.getWeekNumber()){
				manageExpenses.lastWeekExpenditure = weeklyExpenseList[weeklyExpenseList.length-1];
				manageExpenses.expensesToday = dailyExpensesList[dailyExpensesList.length-1];
			}
			else{
				manageExpenses.expensesToday = 0;
				manageExpenses.lastWeekExpenditure = 0;
			}
			/*#endRegion */

			
		}

		function isNotEmptyList(){
			return !(_.isEmpty(manageExpenses.expensesList));	
		}
		

		function cancel(){
			manageExpenses.newExpense = {};
		}

		function moveToUpdate(expense){
			manageExpenses.newExpense._id = expense._id;
			manageExpenses.newExpense.amount = expense.amount;
			manageExpenses.newExpense.description = expense.description;
			manageExpenses.newExpense.comment = expense.comment;
			manageExpenses.newExpense.date = expense.date;
		}

		function showAdd(){
			return (typeof (manageExpenses.newExpense._id) === 'undefined');
		}

		function deleteExpense(_id){
			userDataService.deleteExpense(_id)
			.then(function(res){
				if(res)
					getExpenses();
			});
		}

		function updateExpense(){
			userDataService.updateExpense(manageExpenses.newExpense._id, manageExpenses.newExpense);
			getExpenses();
			manageExpenses.newExpense = {};
		}

		function addNewExpense(){
			if(isEmptyNewExpense()) return false;
			else{
				userDataService.addNewExpense(manageExpenses.newExpense)
				.then(function(){
					getExpenses();
					manageExpenses.newExpense = {};
				});
			}
		}

		function getExpenses(){
			userDataService.getUserExpenses()
			.then(function(){
				manageExpenses.expensesList = userDataService.expensesList;
				getAnalytics();
			});
		}

		function isEmptyNewExpense(){
			return _.isEmpty(manageExpenses.newExpense);
		}

		function init(){
			manageExpenses.newExpense = {};
			getExpenses();
			setTabValue(1);
		}

		init();
	}

	var app = angular.module('track-expenses');
	app.controller('ManageExpensesCtrl', ['userDataService', ManageExpensesCtrl]);

})();
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
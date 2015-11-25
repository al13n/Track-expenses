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
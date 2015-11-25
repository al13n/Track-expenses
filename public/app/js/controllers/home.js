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
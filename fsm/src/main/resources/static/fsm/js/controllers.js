'use strict';

/* Controllers */

var fsmControllers = angular.module('fsmControllers', []);

fsmControllers.controller('fsmLoaderCtrl', ['$scope', '$http', '$location', 
  function($scope,  $http, $location) {

	var self = this;
	$scope.fsm = {}; // holds the FiniteStateMachine
	$scope.machineName = "TestMachineName1";
	$scope.machineNames = [];

	$scope.createFSM = function() {
		var machineName = $scope.machineName;
		var req = {
			method : 'POST',
			url : '/fsm/createFSM',
			headers : {
				'Content-Type' : "application/json",
				'Accept' : "application/json"
			},
			data : {
				fsm : {
					name : machineName
				}
			}

		}
		$http(req).success(function(data, status, headers, config) {
			$location.path("/fsm/" + machineName); 
		}).error(function(data, status, headers, config) {
			// called asynchronously if an error occurs
			// or server returns response with an error status.
			$scope.fsmMessage = "error getting resource"
		});
	}
	
	$scope.listFSM = function() {
		var machineName = self.machineNames;
		var req = {
			method : 'GET',
			url : '/fsm/listMachineNames',
			headers : {
				'Content-Type' : "application/json",
				'Accept' : "application/json"
			}

		}
		$http(req).success(function(data, status, headers, config) {
			self.machineNames = [];
			$scope.machineNames = [];
			var idx = 0; 
			for(var machine in  data.machineNames){
				var listItem = {};
				listItem.idx = idx;
				listItem.machineName =  data.machineNames[idx];
				idx++;
				$scope.machineNames.push(listItem);
			}
		}).error(function(data, status, headers, config) {
			// called asynchronously if an error occurs
			// or server returns response with an error status.
			$scope.machineNames = "error getting resource"
		});
			
	}
	
	$scope.selectFSM = function(selected) {
		var machineName = selected;
		$location.path("/fsm/" + machineName); 

			
	}
	$scope.loadMachineType = function() {
		var machineName2 = self.machineName;
		var machineName3 = $scope.machineName;
		var req = {
			method : 'GET',
			url : '/fsm/getMachineType',
			headers : {
				'Accept' : "application/json",
			},
		}
		$http(req).success(function(data, status, headers, config) {
			$scope.fsmMessage = data.machineType;
		}).error(function(data, status, headers, config) {
			// called asynchronously if an error occurs
			// or server returns response with an error status.
			$scope.fsmMessage = "error getting resource"
		});
	}


	$scope.loadMachineType();
	
	
  }]);

fsmControllers.controller('fsmCtrl', ['$scope', '$routeParams', '$http',
  function($scope, $routeParams, $http) {
	
	
	$scope.getFSM = function() {
		var machineName = $routeParams.machineName;
		$scope.addTransitionSteps = {};
		$scope.addTransitionSteps.initiated = !true;
		$scope.addTransitionSteps.cancelled = true;
		$scope.addTransitionSteps.fromStateIndex = -1;
		$scope.addTransitionSteps.inputSymbolIndex = -1;
		$scope.addTransitionSteps.toStateIndex = -1;

		var req = {
			method : 'POST',
			url : '/fsm/getFSM',
			headers : {
				'Content-Type' : "application/json",
				'Accept' : "application/json"
			},
			data : {
				name : machineName
			}

		}
		$http(req).success(function(data, status, headers, config) {
			$scope.fsmMessage = "";

			
			$scope.fsm = data.fsm; // assign to a scope member the FiniteStateMachine JSON object  
			
			$scope.symbolsInRows = [];
			
			for(var j = 0; j < data.fsm.allStates.length;  j++){
				var st = data.fsm.allStates[j];
				
				var ts = st.nodeTransitions;
				for(var k = 0; k < ts.length; k++){
					var t = ts[k];
					
				}
			}
			
			for(var i = 0; i < data.fsm.allSymbols.length; i++){
				var symbol =  data.fsm.allSymbols[i];
				if(i % 5 === 0){
					$scope.symbolsInRows.push([]);
				}
				var lastRow = $scope.symbolsInRows.length-1;
				
				$scope.symbolsInRows[lastRow].push(symbol.symbol);
				
			}
			$scope.fsmMessage = "Load: done";
			
			/** call d3 initialization */
			initializeFSMGraph($scope.fsm);


		}).error(function(data, status, headers, config) {
			// called asynchronously if an error occurs
			// or server returns response with an error status.
			$scope.machineNames = "error getting resource"
		});
			
	}	
	$scope.getFSM();
	
	$scope.addSymbol = function() {
		var machineName = $routeParams.machineName;
		var symbolToAdd = $scope.symbolToAdd;
		var req = {
			method : 'POST',
			url : '/fsm/addSymbol',
			headers : {
				'Content-Type' : "application/json",
				'Accept' : "application/json"
			},
			data : {
				machineName : machineName,
				symbolName : symbolToAdd
			}

		}
		$http(req).success(function(data, status, headers, config) {
			// load the symols in table 2
			if(data.symbolIndex != -1){
				if($scope.symbolsInRows === null){
					$scope.symbolsInRows = [];
				}
				if(data.symbolIndex % 5 === 0){
					$scope.symbolsInRows.push([]);
				}
				var lastRow = $scope.symbolsInRows.length-1;
				
				$scope.symbolsInRows[lastRow].push($scope.symbolToAdd);
				$scope.fsmMessage = "Add Symbol: done";

			}else{
				$scope.fsmMessage = "Add Symbol: error";

			}

		}).error(function(data, status, headers, config) {
			// called asynchronously if an error occurs
			// or server returns response with an error status.
			$scope.fsmMessage = "Add Symbol: error";
		});
	}

	$scope.addState = function() {
		var machineName =  $routeParams.machineName;
		var stateToAdd = $scope.stateToAdd;
		var req = {
			method : 'POST',
			url : '/fsm/addState',
			headers : {
				'Content-Type' : "application/json",
				'Accept' : "application/json"
			},
			data : {
				machineName : machineName,
				stateName : stateToAdd,
				startState : $scope.startState,
				endState : $scope.endState
			}

		}
		$http(req).success(function(data, status, headers, config) {
			// load the new state in table
			if (data.stateID != -1) {
				var s = {
					state : stateToAdd
				}

				$scope.fsm.allStates.push(s);
				$scope.fsmMessage = "Add State: done";
				addLayoutDataForState($scope.fsm,data.stateID);
				syncFSMGraph($scope.fsm);
			}else{
				$scope.fsmMessage = "Add State: error";
			}
		}).error(function(data, status, headers, config) {
			// called asynchronously if an error occurs
			// or server returns response with an error status.
			$scope.fsmMessage = "Add State: error";
		});
	}

	$scope.addTransition = function() {
		var machineName = $routeParams.machineName;
		var stateToAdd = $scope.stateToAdd;
		//this.b.addToggle = !this.b.addToggle;
		if(!$scope.addTransitionSteps.initiated){
			$scope.addTransitionSteps.initiated = true;
			return;
		}
		// if inputs pending return
		if($scope.addTransitionSteps.fromStateIndex  == -1 ||
		   $scope.addTransitionSteps.toStateIndex  == -1   ||
		   $scope.addTransitionSteps.inputSymbolIndex == -1
		   ){
			return;
		}
			
		var req = {
			method : 'POST',
			url : '/fsm/addTransition',
			headers : {
				'Content-Type' : "application/json",
				'Accept' : "application/json"
			},
			data : {
				machineName : machineName,
				sourceState : $scope.addTransitionSteps.fromStateIndex,
				targetState : $scope.addTransitionSteps.toStateIndex,
				inputSymbol : $scope.addTransitionSteps.inputSymbolIndex
			}

		}
		$http(req).success(function(data, status, headers, config) {
			// load the new state in table
			if (data.transitionID != -1) {
				$scope.fsmMessage = "Add Transition: done";
				var fi = $scope.addTransitionSteps.fromStateIndex;
				
				if($scope.fsm.allStates[fi].nodeTransitions == null){
					$scope.fsm.allStates[fi].nodeTransitions = [];
				}
				var t = {}
				t.toState =  $scope.addTransitionSteps.toStateIndex;
				t.inputSymbol = $scope.addTransitionSteps.inputSymbolIndex;
				$scope.fsm.allStates[fi].nodeTransitions.push(t);
				$scope.addTransitionSteps.cancelled = !true;
				$scope.addTransitionSteps.finished = true;
				$scope.addTransitionSteps.initiated = !true;
				$scope.addTransitionSteps.fromStateIndex  = -1;	
				$scope.addTransitionSteps.toStateIndex  = -1;	
				$scope.addTransitionSteps.inputSymbolIndex = -1;
				
				$scope.addTransitionSteps.finished = true;
				syncSingleStateTransitions($scope.fsm,req.data.sourceState);
			}else{
				$scope.fsmMessage = "Add Transition: error";
				$scope.addTransitionSteps.cancelled = true;
				$scope.addTransitionSteps.finished = true;
				$scope.addTransitionSteps.initiated = !true;
				$scope.addTransitionSteps.fromStateIndex  = -1;	
				$scope.addTransitionSteps.toStateIndex  = -1;	
			}
		}).error(function(data, status, headers, config) {
			// called asynchronously if an error occurs
			// or server returns response with an error status.
			$scope.fsmMessage = "Add Transition: error";
		});
	}

	$scope.symbolClicked = function(symbolIndex){
		if(!$scope.addTransitionSteps.initiated){
			$scope.feedQueue.push(symbolIndex);
			$scope.test = false;
			$scope.newInputSymbol();
			
		}else{
			$scope.addTransitionSteps.inputSymbolIndex = symbolIndex;
			$scope.addTransition();
		}
		
	}
	
	$scope.feedQueue = [];
	
	$scope.testFeed = function(){
		if(!$scope.hasOwnProperty("inputSymbolFeed")){
			$scope.setAcceptanceMessage();
			return;
		}
		var extraFeed = $scope.inputSymbolFeed;
		var feedArray = extraFeed.split(" ");
		var i = 0;
		while(i < feedArray.length){
			var index  = $scope.indexForSymbol(feedArray[i]);
			$scope.feedQueue.push(index);
			i++;
		}
		$scope.test = true;
		$scope.newInputSymbol();

	}
	
	$scope.indexForSymbol = function(symbol){
		var lastRow = $scope.symbolsInRows.length-1;
		var row = 0;
		var i = 0;
		while(row < $scope.symbolsInRows.length){
			var col = 0;
			while(col < $scope.symbolsInRows[row].length){
				if(symbol == $scope.symbolsInRows[row][col]){
					return i;
				}
				i++;
				col++;
			}
			row++;
		}
	}
	
	$scope.isAccepted = function(){
		
		var index = $scope.fsm.currentState;
		var st = $scope.fsm.allStates[index];
		if(!st.hasOwnProperty("stateType")){
			return !true;
		}
		if(st.stateType == "e" || st.stateType == "se"){
			return true;
		}
	}

	$scope.test = {}
	
	$scope.stateColor = function(stateIndex){
		if($scope.fsm.currentState == stateIndex){
			
			var bg = {'background-color':"#AAFFAA"};
			return bg;
		}else{
			var bg = {'background-color':"#FFFFFF"};
			return bg;
		}
	}
	
	$scope.stateClicked = function(stateIndex){
		if(!$scope.addTransitionSteps.initiated){
			return;
		}
		if($scope.addTransitionSteps.fromStateIndex == -1){
			$scope.addTransitionSteps.fromStateIndex  = stateIndex;
			$scope.addTransition();
			return;
		}
		if($scope.addTransitionSteps.toStateIndex == -1){
			$scope.addTransitionSteps.toStateIndex  = stateIndex;
			$scope.addTransition();
			return;
		}
		$scope.addTransition();
		
	}
	
	$scope.toggle = function(event) {
		var e = event;
	}
	
	$scope.setAcceptanceMessage = function(){
	
		if($scope.isAccepted()){
			$scope.fsmMessage = "Input accepted";		
		}else{
			$scope.fsmMessage = "Input rejected";
		}		
		
	}
	
	$scope.newInputSymbol = function() {
		
		var machineName =  $routeParams.machineName;
		if($scope.feedQueue.length < 1){
			if($scope.test){
				$scope.$apply($scope.setAcceptanceMessage);
			}
			return;
		}
		var symbolIndex = $scope.feedQueue.shift();
		if(symbolIndex == undefined){
			$scope.fsmMessage = "symbol input: rejected";
			return;
		}
		var req = {
			method : 'POST',
			url : '/fsm/getTargetStateForState',
			headers : {
				'Content-Type' : "application/json",
				'Accept' : "application/json"
			},
			data : {
				machineName : machineName,
				fromState : $scope.fsm.currentState,
				inputSymbol : symbolIndex
			}

		}
		$http(req).success( function(data, status, headers, config ) {
			// load the new state in table
			if (data.stateID != -1) {
				setCurrentState($scope.fsm.currentState, !true);
				setCurrentState(data.stateID, true);
				$scope.fsm.currentState = data.stateID;

				
				var timeoutID = window.setTimeout($scope.newInputSymbol,2000);
				// feed from feedQueue
			}else{
				$scope.fsmMessage = "symbol input: error";
			}
		} ).error(function(data, status, headers, config) {
			// called asynchronously if an error occurs
			// or server returns response with an error status.
			$scope.fsmMessage = "symbol input: rejected";
		});
	}


}


]);

'use strict';

function initializeFSMGraph(fsm){
	
	var svgW=958, svgH =600, vRad=12; 
	var fsmGraph={cx:300, cy:30, w:40, h:70};

	addLayoutData(fsm);
	
	var topSVG = d3.select("#svgDiv").append("svg").attr("width", svgW).attr("height", svgH).attr('id','fsmGraphSVG');

	var topTransfromGroup = d3.select('#fsmGraphSVG').append('g').call(d3.behavior.zoom().scaleExtent([0.1, 100]).on("zoom", zoom)).attr('id','topGroup');
	
	var width = 960,
    height = 500;
	var rec = topTransfromGroup.append("rect")
    .attr("class", "overlay")
    .attr("width", width)
    .attr("height", height);
	
	var stateCirclesGroup = topTransfromGroup.append('g').attr('id','stateCircles');

	var stateTransitionPathsGroup = topTransfromGroup.append('g').attr('id','stateTransitionPaths');
	
	// there is no z - draw in the order desired
	// draw lines for transitions
	syncTransitions2(fsm);

	// draw circles and text for states
	syncFSMGraph(fsm);
	setStartAsCurrent(fsm);

	
	function zoom() {
		topTransfromGroup.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
	}

}





// insert position and other graphic data to the fsm
// transitions are just lines between states in this version
function addLayoutData(fsm){
	for(var j = 0; j < fsm.allStates.length;  j++){
		addLayoutDataForState(fsm,j);
	}

}

function addLayoutDataForState(fsm,j){
		var st = fsm.allStates[j];
		
		var xspace = 120;
		var yspace = 120;
		
		// set circle center with a small random perturbation
		
		st.p = {};
		st.p.x =   80  + j%5*xspace + (Math.random()-0.5)*xspace/4;
		st.p.y =   80 +  Math.floor(j/5)*yspace + (Math.random()-0.5)*yspace/4;

}

function syncFSMGraph(fsm){
	
	var vRad=12; 

	var stateCirclesGroup =  d3.select('#stateCircles'); 

	var startColor = "blue";
	var endColor = "green";
		var stateG = stateCirclesGroup.selectAll('g').data(fsm.allStates).enter().append('g');
		stateG.append('circle').attr('id',function(d,i){ return "gs" + i;}).attr('cx',function(d,i){ return  d.p.x;}).attr('cy',function(d,i){ return d.p.y;}).attr('r',vRad).attr('fill',function(d,i){if (!d.hasOwnProperty("stateType")) return "whitesmoke"; if(d.stateType == "s")return "blue"; if(d.stateType == "e")return "green"; } ).attr('stroke',"black" ).attr('fill-opacity',"0.5");
		stateG.append('text').attr('x',function(d,i){ return  d.p.x-6;}).attr('y',function(d,i){ return d.p.y+3;}).attr('fill',"whitesmoke" ).attr('stroke',"black" ).attr('fill-opacity',"0.5").text(function(d,i){
			return  d.state;
			});



}

function setStartAsCurrent(fsm ){
	for(var i = 0; i < fsm.allStates.length; i++){
		var st = fsm.allStates[i];
		
		if(st.hasOwnProperty("stateType") && st.stateType == "s"){
			fsm.currentState = i;
			setCurrentState(i,true);
		}
	}
}


function setCurrentState(stateIndex, set){
	d3.select("#gs" + stateIndex).attr("r",set ? 15 : 12).attr('stroke',set? "yellow" : "black").attr('stroke-width',set? 3 : 1);
	
}

function syncTransitions(fsm , stateIndex){

		//var stateTransitionPathsGroup = topTransfromGroup.append('g').attr('id','stateTransitionPaths');
	computeExitAngles(fsm);
	createAngleSortedIndex(fsm);
	equiDistributeExitAngle(fsm, 12);
	var st = fsm.allStates[stateIndex];
	
	var ts = st.nodeTransitions;

//	var curGLines = d3.select("#st" + stateIndex).selectAll("g").data(ts).enter().append('g').attr('id',function(d,i ){return "st" + stateIndex + "-" + i;} );
	var curGLines = d3.select("#st" + stateIndex);
	var curLines = curGLines.selectAll("g").data(ts);
	
	
	curLines.enter().append('path').attr('stroke',"black" ).attr('fill',"none" ).
	attr('d',function(d,i){ 
		var points = ts[i].pathPoints;
		var curve = "M " + points[0].x + " " + points[0].y  + " C";
			
		var k = 0;
		
		while(k < points.length){
			curve += " " +  points[k].x + ", " + points[k].y;
			k++;
		}
		return curve;
	});
	
	
	
	/** */
	var curTexts = curGLines.selectAll("g").data(ts);
	
	curTexts.enter().append('text').attr('x',function(d,i){return ts[i].pathPoints[1].x;} ).
	attr('y',function(d,i){return ts[i].pathPoints[1].y;}  ).text(function(d,i){return fsm.allSymbols[ ts[i].inputSymbol].symbol;});
	
	
	/** arrow heads*/
	var curArrow1 = curGLines.selectAll("g").data(ts);

	curArrow1.enter().append('line').attr('stroke',"black" ).
	attr('x1',function(d,i){  return ts[i].pathPoints[5].x;}).
	attr('y1',function(d,i){  return ts[i].pathPoints[5].y;}).
	attr('x2',function(d,i){  return ts[i].arrowPoint1.x;}).
	attr('y2',function(d,i){  return ts[i].arrowPoint1.y;});
	
	var curArrow2 = curGLines.selectAll("g").data(ts);

	curArrow2.enter().append('line').attr('stroke',"black" ).
	attr('x1',function(d,i){  return ts[i].pathPoints[5].x;}).
	attr('y1',function(d,i){  return ts[i].pathPoints[5].y;}).
	attr('x2',function(d,i){  return ts[i].arrowPoint2.x;}).
	attr('y2',function(d,i){  return ts[i].arrowPoint2.y;});


}


function appendD3(d,i){
	return syncAppendTransition("tmp", d, fsm );
}

function syncTransitions2(fsm ){
	computeExitAngles(fsm);
	createAngleSortedIndex(fsm);
	equiDistributeExitAngle(fsm, 12);

	
	
	//var stateTransitionPathsGroup = topTransfromGroup.append('g').attr('id','stateTransitionPaths');
	var stateTransitionPathsGroup = d3.select('#stateTransitionPaths');
	stateTransitionPathsGroup.selectAll("g").data(fsm.allStates).enter().append('g').attr('id',function(d,i){return "st" + i;});
	
	for(var j = 0; j < fsm.allStates.length;  j++){
		var st = fsm.allStates[j];
		
		var ts = st.nodeTransitions;
		var currentTransitions = stateTransitionPathsGroup.selectAll("g").data(ts);
		
		// id the transitions per state
		//var curGLines = currentTransitions.enter().append('g').attr('id',function(d,i ){return "st" + j + "-" + i;} );
		var curGLines1 = d3.select("#st" + j);
		var curGLines = curGLines1.selectAll("g");
		curGLines.data(ts).enter().append(function(d,i) {return syncAppendTransition( d, fsm );})
		.attr('id',function(d,i ){
			return "st" + j + "-" + i;
			
		} );
			
	}
	
	
}

function syncSingleStateTransitions(fsm , j){
	// compute only or the from state
	computeExitAngles(fsm);
	createAngleSortedIndex(fsm);
	equiDistributeExitAngle(fsm, 12);

	
	var st = fsm.allStates[j];
	
	var ts = st.nodeTransitions;
	var curGLines1 = d3.select("#st" + j);
	var curGLines = curGLines1.selectAll("g").remove();
	curGLines = curGLines1.selectAll("g")
	curGLines.data(ts).enter().append(function(d,i) {return syncAppendTransition( d, fsm );})
	.attr('id',function(d,i ){
		return "st" + j + "-" + i;
		
	} );	
}


var svgns = "http://www.w3.org/2000/svg";

function syncAppendTransition( ts, fsm ){
	var curGLines = document.createElementNS(svgns, "g");
	//curGLines.setAttribute("id",transId);
	appendTransition(curGLines,ts,fsm);
	return curGLines;
}

function curveString(points){
	var curve = "M " + points[0].x + " " + points[0].y  + " C";
		
	var k = 0;
	
	while(k < points.length){
		curve += " " +  points[k].x + ", " + points[k].y;
		k++;
	}
	return curve;

}

function appendTransition(parent,ts,fsm){
	appendPath(parent,ts,fsm);
	appendText(parent,ts,fsm);
	appendArrows(parent,ts);
}

function appendPath(parent,ts,fsm){
	var curve = document.createElementNS(svgns, "path");
	var points = ts.pathPoints;
	var str = curveString(points);
	curve.setAttribute("d",str);
	curve.setAttribute("stroke","black");
	curve.setAttribute("fill","none");
	parent.appendChild(curve);

}


function appendText(parent,ts,fsm){
	var text = document.createElementNS(svgns, "text");
	text.setAttribute("x",ts.pathPoints[1].x);
	text.setAttribute("y",ts.pathPoints[1].y);
	text.value = fsm.allSymbols[ ts.inputSymbol].symbol;
	
	var textNode = document.createTextNode(fsm.allSymbols[ ts.inputSymbol].symbol);
	text.appendChild(textNode);
	
	parent.appendChild(text);	
}

function appendArrows(parent,ts){
	var curArrow1 = document.createElementNS(svgns, "line");
	curArrow1.setAttribute('stroke',"black" );
	curArrow1.setAttribute("x1",ts.pathPoints[5].x);
	curArrow1.setAttribute("y1",ts.pathPoints[5].y);
	curArrow1.setAttribute("x2",ts.arrowPoint1.x);
	curArrow1.setAttribute("y2",ts.arrowPoint1.y);

	var curArrow2 = document.createElementNS(svgns, "line");

	curArrow2.setAttribute('stroke',"black" );
	curArrow2.setAttribute("x1",ts.pathPoints[5].x);
	curArrow2.setAttribute("y1",ts.pathPoints[5].y);
	curArrow2.setAttribute("x2",ts.arrowPoint2.x);
	curArrow2.setAttribute("y2",ts.arrowPoint2.y);
	
	parent.appendChild(curArrow1);
	parent.appendChild(curArrow2);
}


/**
 * return the angle made by vector p1,p2 with +ve x axis as 0 - 2*PI
 * @param p1
 * @param p2
 * @returns
 */
function lineAngle(p1,p2){
	var dx = p2.x - p1.x;
	var dy = p2.y - p1.y;
	
	if(Math.abs(dx) < 0.0000001){
		return dy > 0 ? Math.PI/2 : -Math.PI/2;
	}
	if(Math.abs(dy) < 0.0000001){
		return dx > 0 ? 0 : Math.PI;
	}
	if(dx > 0 && dy > 0){
		return Math.atan(dy/dx);		
	}
	if(dx < 0 && dy > 0){
		return Math.atan(dy/dx)+Math.PI;		
	}
	if(dx < 0 && dy < 0){
		return Math.atan(dy/dx)+Math.PI;		
	}
	if(dx > 0 && dy < 0){
		return Math.atan(dy/dx)+2*Math.PI;		
	}
	
	
}

function computeExitAngles(fsm ){
	for(var j = 0; j < fsm.allStates.length;  j++){
		var st = fsm.allStates[j];
		
		var ts = st.nodeTransitions;
		for(var k = 0; k < ts.length;k++){
			ts[k].angle = lineAngle(st.p,fsm.allStates[ts[k].toState].p);
		}
		
	}

}

function createAngleSortedIndex(fsm){
	
	function angleCompare(i1,i2 /*,fromState,transitions,allStates */){
		var angle1 = transitions[i1].hasOwnProperty("angle") ?  transitions[i1].angle : transitions[i1].angle = lineAngle(fromState.p,allStates[transitions[i1].toState].p);
		var angle2 = transitions[i2].hasOwnProperty("angle") ?  transitions[i2].angle : transitions[i2].angle = lineAngle(fromState.p,allStates[transitions[i2].toState].p);
		if(angle1 < angle2) return -1;
		if(angle1 == angle2) return 0;
		if(angle1 > angle2) return 1;
	}
	
	for(var j = 0; j < fsm.allStates.length;  j++){
		var st = fsm.allStates[j];
		
		var ts = st.nodeTransitions;
		
		st.angleSortedIndices = [];
		var i = 0;
		while(i < ts.length){
			st.angleSortedIndices.push(i);
			i++;
		}
		var fromState = st;
		var transitions = ts;
		var allStates = fsm.allStates;
		
		st.angleSortedIndices.sort(angleCompare);
	}
}


function equiDistributeExitAngle(fsm, rad){
	
	
	for(var j = 0; j < fsm.allStates.length;  j++){
		var st = fsm.allStates[j];
		
		var ts = st.nodeTransitions;
		
		var exitCountByQuarter = [0,0,0,0];
		var i = 0;
		while(i < st.angleSortedIndices.length){
			var index = st.angleSortedIndices[i];
			if(st.nodeTransitions[index].angle >= 0 && st.nodeTransitions[index].angle < Math.PI/2){
				exitCountByQuarter[0]++;
			}else if(st.nodeTransitions[index].angle >= Math.PI/2 && st.nodeTransitions[index].angle < Math.PI){
				exitCountByQuarter[1]++;
			}else if(st.nodeTransitions[index].angle >= Math.PI && st.nodeTransitions[index].angle < 3/2*Math.PI){
				exitCountByQuarter[2]++;
			}else{
				exitCountByQuarter[3]++;
			}
			
			i++;
		}
		i = 0;
		var c1=1,c2=1,c3=1,c4=1;
		while(i < st.angleSortedIndices.length){
			var index = st.angleSortedIndices[i];
			if(st.nodeTransitions[index].angle >= 0 && st.nodeTransitions[index].angle < Math.PI/2){
				
				st.nodeTransitions[index].equiAngle = (c1++)*Math.PI/2/(exitCountByQuarter[0]+1);
			}else if(st.nodeTransitions[index].angle >= Math.PI/2 && st.nodeTransitions[index].angle < Math.PI){
				
				st.nodeTransitions[index].equiAngle = Math.PI/2 + (c2++)*Math.PI/2/(exitCountByQuarter[1]+1);
			}else if(st.nodeTransitions[index].angle >= Math.PI && st.nodeTransitions[index].angle < 3/2*Math.PI){
				
				st.nodeTransitions[index].equiAngle = Math.PI + (c3++)*Math.PI/2/(exitCountByQuarter[2]+1);
			}else{
				
				st.nodeTransitions[index].equiAngle = 3/2*Math.PI + (c4++)*Math.PI/2/(exitCountByQuarter[3]+1);
			}
			
			i++;
		}
		
		
		i = 0;
		/**
		 * calculate path points
		 * 6 point absolute bezier and 2 points for arrow heads
		 */

		i = 0;
		while(i < st.angleSortedIndices.length){
			var index = st.angleSortedIndices[i];
			
			var pathPoints = [];
			st.nodeTransitions[index].pathPoints = pathPoints;
			var xt = Math.cos(st.nodeTransitions[index].equiAngle) ;
			var yt = Math.sin(st.nodeTransitions[index].equiAngle) ;
			var startPoint = {};
			startPoint.x = xt*rad + st.p.x;
			startPoint.y = yt*rad + st.p.y;
			pathPoints.push(startPoint);
			var p = {};
			p.x = xt*3*rad + st.p.x;
			p.y = yt*3*rad + st.p.y;
			pathPoints.push(p);
			
			/**
			 * last point 
			 */
			var p1 = fsm.allStates[st.nodeTransitions[index].toState].p;
			if(j != st.nodeTransitions[index].toState){
				var p2 = p;
			}else{
				var p2 = {};
				p2.x = p.x + 12;; 
				p2.y = p.y
			}
			
			p = {};
			var d =  distance(p1,p2);
			p.x = p1.x + (p2.x - p1.x)/d*rad*3;
			p.y = p1.y + (p2.y - p1.y)/d*rad*3;
			pathPoints.push(p);
			
			p = {};
			p.x = p1.x + (p2.x - p1.x)/d*rad*2.5;
			p.y = p1.y + (p2.y - p1.y)/d*rad*2.5;
			pathPoints.push(p);

			p = {};
			p.x = p1.x + (p2.x - p1.x)/d*rad*2;
			p.y = p1.y + (p2.y - p1.y)/d*rad*2;
			pathPoints.push(p);

			p = {};
			p.x = p1.x + (p2.x - p1.x)/d*rad;
			p.y = p1.y + (p2.y - p1.y)/d*rad;
			pathPoints.push(p);

			
			//pathPoints.push(fsm.allStates[st.nodeTransitions[index].toState].p);
		
			// arrow heads
			
			p1 = pathPoints[5];
			p2 = pathPoints[3];
			var angle = lineAngle(p1,p2);
			
			var angle1 = angle + Math.PI/8;
			var angle2 = angle - Math.PI/8;
			
			st.nodeTransitions[index].arrowPoint1 = {};
			st.nodeTransitions[index].arrowPoint2 = {};
			
			st.nodeTransitions[index].arrowPoint1.x = p1.x + rad/1.5*Math.cos(angle1);
			st.nodeTransitions[index].arrowPoint1.y = p1.y + rad/1.5*Math.sin(angle1);
			
			st.nodeTransitions[index].arrowPoint2.x = p1.x + rad/1.5*Math.cos(angle2);
			st.nodeTransitions[index].arrowPoint2.y = p1.y + rad/1.5*Math.sin(angle2);
						
			
			i++;
		}
	
	}
}


function closePoints(p1,p2,prec){
	return ( Math.abs(p2.x-p1.x) + Math.abs(p2.y-p1.y) ) < prec;

}


function distanceSqr(p1,p2){
	return  (p2.x-p1.x)*(p2.x-p1.x) + (p2.y-p1.y)*(p2.y-p1.y);

}

function distance(p1,p2){
	return Math.sqrt( (p2.x-p1.x)*(p2.x-p1.x) + (p2.y-p1.y)*(p2.y-p1.y));
}


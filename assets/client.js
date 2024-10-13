
/*****************/

// FOR FRONTEND PEOPLE

// dont change this, use `setSharing(..)` below
window.loc_enabled = true;
window.status = "Social";

// STORE LOGIN DETAILS IN `document.cookie` CHATGPT IT YES
// SET A COOKIE CALLED `userid` TO THE USERNAME OR USERID

// toggles between active sharing and not-sharing
// setSharing(true) = send current location to server
// setSharing(false) = stop sending location to server
function setSharing(yesno){
	
	if(yesno){
		// start sending updates from `onLocationUpdate`
		loc_enabled = true;
	}
	else{
		loc_enabled = false;
		submitState("Home");
	}
}

// IMPLEMENT THIS
function UpdateUI( state ){
	// `state` is an "object" or dictionary
	// of building numbers (say 3900 for CSE2)
	// and the people in it (its a Array[string] )
	// leave user-icons blank for now, we can css some 
	// randomized styling later.

}

/*****************/

// helper error callback
function error(str){
	return ()=>{console.err(str)}
}

// helper queryselector, can't use jquery
function $(x){
	return document.querySelector(x)
}

// helper queryselector, can't use jquery
function $$(x){
	return document.querySelectorAll(x)
}


// called when the user moves
function onLocationUpdate(location){

	let coords = location.coords;

	if(window.loc_enabled){
		getLocationFromCoords(coords);
	}
}

// convert (lat, lon) to a location string (Building name, etc)
// get coords from navigator.geolocation.getCurrentPosition(coords=> ... )
function getLocationFromCoords(coords){

	fetch(
		`https://nominatim.openstreetmap.org/reverse?lat=${coords.latitude}&lon=${coords.longitude}&format=json`
	).then(res => res.json())
     .then(res => {
     	console.debug(res)
     	
     	// import places.js please
     	let place = res.address.house_number;

     	if(place == undefined){
     		place = "SIDEWALK"
     	}
     	
     	submitState(place, window.status);
	})
}

// Set a geolocation hook
navigator.geolocation.watchPosition(
	onLocationUpdate, error("Location Failed"), {enableHighAccuracy: true})

navigator.geolocation.getCurrentPosition(
	onLocationUpdate, error("Location Failed"), {enableHighAccuracy: true})

function submitState(place, status){
	fetch("/api/log", {
		method: 'POST',
    	headers: {
        	'Content-Type': 'application/json'
        },
        body: JSON.stringify([place, status])
	})
}

// fetch all states
function getStates(){
	return fetch("/api/fetch")
		.then(r=>r.json()) // that was easy

	// you gotta use it like
	// getStates().then(
	//    states => ...
	// )
	// you still need to `JSON.parse` each state tho
	// ( T_T   I'm sorry)
}
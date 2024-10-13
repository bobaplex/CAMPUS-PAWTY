
/*****************/

// FOR FRONTEND PEOPLE

// dont change this, use `setSharing(..)` below
window.loc_enabled = true;
window.status = "Social";
window.place = "home";

// toggles between active sharing and not-sharing
// setSharing(true) = send current location to server
// setSharing(false) = stop sending location to server
function setSharing(yesno){
	
	if(yesno){
		// start sending updates from `onLocationUpdate`
		document.querySelector("#buttons button").style = ""
		loc_enabled = true;
	}
	else{
		document.querySelector("#buttons button").style = "opacity: 70%"
		loc_enabled = false;
		window.place = "home"
	}
}

// IMPLEMENT THIS
function UpdateUI(){
	
	let state = window.state
	window.status = document.querySelector('input:checked').value; // get the radio buttons

	document.querySelectorAll('.building').forEach(e=>e.innerHTML="")
	document.querySelector('#sidewalk').innerHTML = ""
	document.querySelector('#home').innerHTML = ""

	for(const building in state){

		let target = document.getElementById("b"+building)
		let data = ""
		target = target? target : document.getElementById("home")

		for(const [user, status] of state[building]){

			data += `<span class="user ${status}" onclick="call('${user}')"><img src="profile.png"></span>`

		}

		// console.log(building, target, data)
		target.innerHTML = data
	}

	getStates()
	submitState()

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
     	
     	window.place = place
	})
}

// Set a geolocation hook
navigator.geolocation.watchPosition(
	onLocationUpdate, error("Location Failed"), {enableHighAccuracy: true})

navigator.geolocation.getCurrentPosition(
	onLocationUpdate, error("Location Failed"), {enableHighAccuracy: true})

function submitState(){
	place = window.place
	status = window.status
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
		.then(r=>r.json())
		.then(r=>window.state=r)
}



//**************//

function togglelocation(){
	setSharing(!window.loc_enabled)
}

document.querySelectorAll(".building").forEach(e=>{
    e.onclick = ()=>console.log(e.id)
})

setInterval(UpdateUI, 5000)

function call(user){
	if(
		window.confirm("you are about to call " + user)
	){
		window.location.href = "/call.html"
	}
}
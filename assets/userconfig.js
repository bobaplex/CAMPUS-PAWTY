// Use the existing `getStates` function to fetch the map from the server
function getStates() {
    return fetch("/api/fetch")
        .then(r => r.json()); // Returns the inverted map from the server
}

// Process the fetched map to group users by building
async function loadAndDisplayUsers(buildingId) {
    // Fetch the states using the existing function
    const states = await getStates();
    // states is a map of <building, tuple<name, status>[]>

    // Display users for the specified building ID
    displayUsersOfBuilding(buildingId, states);
}

// Display users for a particular building
function displayUsersOfBuilding(buildingId, states) {
    const users = states[buildingId] || [];

    // Update the UI to display users in this building
    console.log(`Displaying users for building ${buildingId}:`, users);

    // Example UI update (add your own DOM manipulation logic)
    const userList = document.getElementById('user-list');
    userList.innerHTML = ''; // Clear the existing list
    users.forEach(user => {
        let [username, status] = user;
        const userItem = document.createElement('li');
        userItem.textContent = `${username} (${status})`;
        userList.appendChild(userItem);
    });
}

// Event handling: Add an event listener to the Load Users button
/*
document.getElementById('load-users-button').addEventListener('click', () => {
    const buildingId = prompt("Enter the building ID to load users:"); // Prompt for building ID
    if (buildingId) {
        loadAndDisplayUsers(buildingId); // Call the function with the specified building ID
    }
});
*/

document.querySelectorAll(".building-div").forEach(e=>{
    e.onclick = ()=>loadAndDisplayUsers(e.id)
})
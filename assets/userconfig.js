// Use the existing `getStates` function to fetch the map from the server
function getStates() {
    return fetch("/api/fetch")
        .then(r => r.json()); // Returns the inverted map from the server
}

// Process the fetched map to group users by building
async function loadAndDisplayUsers(buildingId) {
    // Fetch the states using the existing function
    const states = await getStates();

    // Process the map to group users by building
    const grouped = groupedUsers(states); // Group the users by building ID

    // Display users for the specified building ID
    displayUsersOfBuilding(buildingId, grouped);
}

// Group users by building ID
function groupedUsers(userMap) {
    const grouped = {};

    // Iterate through each building ID and its associated users
    for (let [place, users] of Object.entries(userMap)) {
        if (!grouped[place]) {
            grouped[place] = [];
        }

        // Add users to the corresponding building group
        grouped[place].push(...users);
    }

    return grouped;
}

// Display users for a particular building
function displayUsersOfBuilding(buildingId, groupedUsers) {
    const users = groupedUsers[buildingId] || [];

    // Update the UI to display users in this building
    console.log(`Displaying users for building ${buildingId}:`, users);

    // Example UI update (add your own DOM manipulation logic)
    const userList = document.getElementById('user-list');
    userList.innerHTML = ''; // Clear the existing list
    users.forEach(user => {
        const userItem = document.createElement('li');
        userItem.textContent = `${user.username} (${user.status})`;
        userList.appendChild(userItem);
    });
}

// Event handling: Add an event listener to the Load Users button
document.getElementById('load-users-button').addEventListener('click', () => {
    const buildingId = prompt("Enter the building ID to load users:"); // Prompt for building ID
    if (buildingId) {
        loadAndDisplayUsers(buildingId); // Call the function with the specified building ID
    }
});
